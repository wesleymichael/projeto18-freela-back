import { db } from "../database/database.js";

export async function getFollowingsDB(usernameId, myUserId){
    const results = await db.query(`
        SELECT
            u.id, u.username, u.img,
            EXISTS (SELECT 1 FROM followers WHERE "userId" = $2 AND following = u.id) AS "isFollowing"
        FROM 
            users u
        JOIN
            followers f ON u.id = f."following"
        WHERE
            f."userId" = $1;
    `, [usernameId, myUserId]);
    return results;
}

export async function getFollowersDB(usernameId, myUserId){
    const results = await db.query(`
    SELECT 
        u.id, u.username, u.img,
        EXISTS (SELECT 1 FROM followers WHERE "userId" = $2 AND following = u.id) AS "isFollowing"
    FROM 
        followers f
    JOIN 
        users u ON f."userId" = u.id
    WHERE 
        f.following = $1;
    `, [usernameId, myUserId]);
    return results;
}

export async function followDB(usernameId, myUserId) {
    const results = await db.query(`
    INSERT INTO followers ("userId", "following")
        SELECT $2, $1
        WHERE NOT EXISTS (
            SELECT 1
            FROM followers
            WHERE "userId" = $2 AND "following" = $1
        )
    RETURNING *;
    `,[usernameId, myUserId]);
    return results;
}

export async function unfollowDB(usernameId, myUserId){
    const results = await db.query(`
        DELETE FROM followers
	        WHERE "userId" = $2 AND "following" = $1;
    `,[usernameId, myUserId]);
    return results;
}
