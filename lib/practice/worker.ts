import "server-only";
import type { Channel, Notice, NoticeStatus } from "./automations";

export function workerConfigured() {
  return Boolean(process.env.NOTIFICATION_WORKER_URL?.trim() && process.env.NOTIFICATION_WORKER_API_KEY?.trim());
}

export const configMessage = "Попълнете адреса и клиентския ключ на notification-worker за Smile Craft.";

type Outcome = { status: NoticeStatus; id?: string; error?: string };
type WorkerReply = { jobId?: string; status?: string; invalid?: number; failed?: number };

async function request(path: string, method: string, payload?: unknown) {
  const url = process.env.NOTIFICATION_WORKER_URL!.trim().replace(/\/+$/, "");
  const response = await fetch(url + "/api/v1/" + path, {
    method, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000),
    headers: { Authorization: "Bearer " + process.env.NOTIFICATION_WORKER_API_KEY!.trim(), "Content-Type": "application/json" },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  const data: WorkerReply = await response.json().catch(() => ({})) ?? {};
  return { response, data };
}

function outcome(data: WorkerReply): Outcome {
  if (typeof data.jobId !== "string" || !data.jobId) return { status: "error", error: "Worker-ът върна непълен отговор." };
  if (data.failed || data.invalid || data.status === "partial" || data.status === "failed") {
    return { status: "failed", id: data.jobId, error: "Worker-ът отчита неуспешно изпращане." };
  }
  if (data.status === "sent" || data.status === "pending" || data.status === "processing" || data.status === "canceled") {
    return { status: data.status, id: data.jobId };
  }
  return { status: "error", id: data.jobId, error: "Непознат статус от worker-а." };
}

function httpError(status: number, data: WorkerReply): Outcome {
  const details = status === 401 || status === 403 ? "Проверете клиентския ключ."
    : status === 400 ? "Проверете получателя и настройките на подателя за канала."
    : "Опитайте отново.";
  return { status: "error", id: data.jobId, error: `Worker HTTP ${status}. ${details}` };
}

function key(n: Notice) { return `smile-craft:${n.id}:${n.attempt}`; }
function pathFor(channel: Channel) { return channel === "sms" ? "sms/" : ""; }
function html(text: string) {
  return "<p>" + text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\r?\n/g, "<br>") + "</p>";
}

export async function submitNotice(n: Notice): Promise<Outcome> {
  const content = n.channel === "sms" ? { body: n.body } : {
    subject: n.subject, html: html(n.body), from: process.env.NOTIFICATION_WORKER_FROM?.trim() || undefined,
    replyTo: process.env.NOTIFICATION_WORKER_REPLY_TO?.trim() || undefined,
  };
  const { response, data } = await request(pathFor(n.channel) + (n.send_at ? "schedule" : "send"), "POST", {
    ...content, recipients: [n.recipient], idempotencyKey: key(n), sendAt: n.send_at ?? undefined,
  });
  return response.ok ? outcome(data) : httpError(response.status, data);
}

export async function inspectNotice(n: Notice): Promise<Outcome> {
  const { response, data } = await request(pathFor(n.channel) + "jobs/" + encodeURIComponent(n.worker_id!), "GET");
  if (!response.ok) throw new Error("Worker status unavailable");
  return outcome(data);
}

export async function stopNotice(n: Notice): Promise<Outcome> {
  let id = n.worker_id;
  // A schedule request can time out after the worker has already created the reminder.
  if (!id && n.tries && n.channel === "email") {
    const { response, data } = await request("jobs/lookup?key=" + encodeURIComponent(key(n)), "GET");
    if (response.status === 404) return { status: "canceled" };
    if (!response.ok || !data.jobId) return httpError(response.status, data);
    id = data.jobId;
  }
  if (!id) return { status: "canceled" };
  const { response, data } = await request(pathFor(n.channel) + "jobs/" + encodeURIComponent(id), "DELETE");
  if (response.ok || response.status === 404) return { status: "canceled", id };
  if (response.status === 409) return outcome({ ...data, jobId: id });
  return httpError(response.status, data);
}
