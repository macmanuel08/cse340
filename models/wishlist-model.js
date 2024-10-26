const pool = require("../database/")

/* *****************************
*   Add to the Wishlist
* *************************** */
async function addWishlist(inv_id, account_id){
    try {
      const sql = "INSERT INTO wishlist (inv_id, account_id) VALUES ($1, $2) RETURNING *"
      return await pool.query(sql, [inv_id, account_id])
    } catch (error) {
      return error.message
    }
}

/* *****************************
*   Check if intentory item was added to the wishlist
* *************************** */
async function addedToWishlist(inv_id, account_id){
  try {
    const sql = "SELECT inv_id FROM wishlist WHERE inv_id = $1 AND account_id = $2"
    return await pool.query(sql, [inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Remove from the Wishlist
* *************************** */
async function removeWishlist(inv_id, account_id){
  try {
    const sql = "DELETE FROM wishlist WHERE inv_id = $1 AND account_id = $2 RETURNING *"
    return await pool.query(sql, [inv_id, account_id])
  } catch (error) {
    new Error("Delete error: " + error)
  }
}

module.exports = { addWishlist, addedToWishlist, removeWishlist }