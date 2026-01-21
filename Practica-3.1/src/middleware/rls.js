/*
1. Usuario envia request con JWT
2. JWT Contiene el id y el username: "Angel"
3. Middleware agrega un WHERE userid = 1
4. Query: SELECT * FROM records WHERE userid = 1
5. Usuario solo ve sus registros
*/

function buildRlsFilter(user) {
    if(user.role === 'admin') {
        return { clause: "1=1", params: []}
    }
    return { clause: "user_id = ?", params: [user.id]};
}

// para verificar si el usuario es dueño de un registro especifico
async function verifyOwnership(pool, table, recordId, userId) {
    const [rows] = await pool.execute(`SELECT user_id FROM ${table} WHERE id = ?`, [recordId]);
    if (rows.length === 0) { // rEGISTRO NO EXISTE
        return false;
    }
    return rows[0].user_id === userId; //¿ Ese es el dueño del registro?
}
export default { buildRlsFilter, verifyOwnership };