/* *******************
* Require
******************** */
const pool = require("../database/");

/********************
* Add a favorite
******************** */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = "INSERT INTO public.favorite (account_id, inv_id) VALUES ($1, $2) RETURNING *";
        const data = await pool.query(sql, [account_id, inv_id]);
        return data.rows[0];
    } catch (error) {
        console.error("Error adding favorite:" + error);
    }
}

/********************
* Remove a favorite for user
******************** */
async function removeFavorite(account_id, inv_id) {
    try {
        const sql = "DELETE FROM public.favorite WHERE account_id = $1 AND inv_id = $2";
        const data = await pool.query(sql, [account_id, inv_id]);
        return data.rowCount > 0; // Return true if a row was deleted, false otherwise
    } catch (error) {
        console.error("Error removing favorite:" + error);
    }
}

/********************
* Get all favorites for a user with inventory details
******************** */
async function getFavoritesByAccountId(account_id) {
    try {
        const sql = `SELECT f.favorite_id, f.favorite_date, i.*
                    FROM public.favorite AS f
                    JOIN public.inventory AS i ON f.inv_id = i.inv_id
                    WHERE f.account_id = $1
                    ORDER BY f.favorite_date DESC`;
        const data = await pool.query(sql, [account_id]);
        return data.rows;
    } catch (error) {
        console.error("Error fetching favorites:" + error);
    }
} 

/********************
* Check if vehicle is already a favorite for the user
******************** */
async function checkFavoriteExists(account_id, inv_id) {
    try {
        const sql = "SELECT favorite_id FROM public.favorite WHERE account_id = $1 AND inv_id = $2";
        const data = await pool.query(sql, [account_id, inv_id]);
        return data.rowCount > 0; // Return true if a favorite exists, false otherwise
    } catch (error) {
        console.error("Error checking favorite existence:" + error);
    }
}

module.exports = {addFavorite, removeFavorite, getFavoritesByAccountId, checkFavoriteExists};