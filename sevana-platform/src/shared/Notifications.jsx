import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../modules/donations/services/notificationService";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try { const result = await getNotifications(); setItems(result.items); setUnreadCount(result.unreadCount); setError(""); }
    catch (requestError) { setError(requestError.message || "Unable to load notifications."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    let active = true;
    getNotifications().then((result) => { if (active) { setItems(result.items); setUnreadCount(result.unreadCount); } })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load notifications."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const mark = async (id) => { try { await markNotificationRead(id); await refresh(); } catch (requestError) { setError(requestError.message || "Unable to update notification."); } };
  const markAll = async () => { try { await markAllNotificationsRead(); await refresh(); } catch (requestError) { setError(requestError.message || "Unable to update notifications."); } };
  return <section className="unified-workspace"><div className="container"><header className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">NOTIFICATION CENTER</span><h1>Notifications</h1><p>{unreadCount} unread · Updates are stored with your account.</p></div><button className="unified-workspace__secondary" onClick={markAll} disabled={!unreadCount}>Mark all read</button></header>{error && <p role="alert" className="unified-workspace__notice">{error}</p>}<section className="unified-workspace__panel">{loading ? <p>Loading notifications…</p> : items.length ? items.map((item) => <article className="unified-workspace__row" key={item.id} style={{ opacity: item.read ? 0.62 : 1 }}><div><strong>{item.title}</strong><small>{item.message} · {new Date(item.createdAt).toLocaleString()}</small></div><div style={{ display: "flex", gap: 12, alignItems: "center" }}><button className="unified-workspace__secondary" onClick={() => mark(item.id)} disabled={item.read}>{item.read ? "Read" : "Mark read"}</button>{item.href && <Link to={item.href}>Open</Link>}</div></article>) : !error && <p>No notifications yet.</p>}</section></div></section>;
}
