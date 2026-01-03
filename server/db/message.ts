import { PoolClient } from 'pg';

export async function sendMessage(
  client: PoolClient,
  data: {
    senderId: number;
    receiverId: number;
    content: string;
    attachments?: string[];
  }
) {
  const result = await client.query(
    `INSERT INTO messages (content, attachments, sender_id, receiver_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      data.content,
      data.attachments ?? [],
      data.senderId,
      data.receiverId,
    ]
  );

  return result.rows[0];
}

export async function getConversation(
  client: PoolClient,
  userA: number,
  userB: number
) {
  const result = await client.query(
    `SELECT *
     FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY timestamp ASC`,
    [userA, userB]
  );

  return result.rows;
}

export async function getInbox(client: PoolClient, userId: number) {
  const result = await client.query(
    `SELECT DISTINCT ON (u.id)
        m.id,
        m.content,
        m.timestamp,
        u.id AS user_id,
        u.name
     FROM messages m
     JOIN users u
       ON u.id = CASE
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
       END
     WHERE m.sender_id = $1 OR m.receiver_id = $1
     ORDER BY u.id, m.timestamp DESC`,
    [userId]
  );

  return result.rows;
}
