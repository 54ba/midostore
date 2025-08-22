import { Database } from 'sqlite3';
import path from 'path';

// Custom SQLite client to replace Prisma when engines are not available
export class SQLiteClient {
    private db: any = null;
    private dbPath: string;

    constructor() {
        this.dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error connecting to SQLite database:', err);
                    reject(err);
                } else {
                    console.log('✅ Connected to SQLite database via custom client');
                    resolve();
                }
            });
        });
    }

    async disconnect(): Promise<void> {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err);
                    }
                    this.db = null;
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    // Product operations
    async productFindMany(options: any = {}): Promise<any[]> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Product';
            const params: any[] = [];

            if (options.where) {
                const conditions: string[] = [];
                Object.entries(options.where).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'object' && value.not !== null) {
                            conditions.push(`${key} IS NOT NULL`);
                        } else {
                            conditions.push(`${key} = ?`);
                            params.push(value);
                        }
                    }
                });
                if (conditions.length > 0) {
                    query += ' WHERE ' + conditions.join(' AND ');
                }
            }

            if (options.orderBy) {
                Object.entries(options.orderBy).forEach(([key, order]) => {
                    query += ` ORDER BY ${key} ${order === 'desc' ? 'DESC' : 'ASC'}`;
                });
            }

            if (options.take) {
                query += ` LIMIT ${options.take}`;
            }

            this.db!.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    async productFindUnique(options: any): Promise<any> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            const { where } = options;
            const key = Object.keys(where)[0];
            const value = where[key];

            const query = `SELECT * FROM Product WHERE ${key} = ?`;

            this.db!.get(query, [value], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    async productUpdate(options: any): Promise<any> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            const { where, data } = options;
            const key = Object.keys(where)[0];
            const value = where[key];

            const setClause = Object.keys(data).map(k => `${k} = ?`).join(', ');
            const query = `UPDATE Product SET ${setClause} WHERE ${key} = ?`;
            const params = [...Object.values(data), value];

            this.db!.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: value, ...data });
                }
            });
        });
    }

    async productCreate(options: any): Promise<any> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            const { data } = options;
            const keys = Object.keys(data);
            const placeholders = keys.map(() => '?').join(', ');
            const query = `INSERT INTO Product (${keys.join(', ')}) VALUES (${placeholders})`;

            this.db!.run(query, Object.values(data), function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...data });
                }
            });
        });
    }

    // Exchange Rate operations
    async exchangeRateFindMany(options: any = {}): Promise<any[]> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM ExchangeRate';
            const params: any[] = [];

            if (options.where) {
                const conditions: string[] = [];
                Object.entries(options.where).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'object' && value.not !== null) {
                            conditions.push(`${key} IS NOT NULL`);
                        } else {
                            conditions.push(`${key} = ?`);
                            params.push(value);
                        }
                    }
                });
                if (conditions.length > 0) {
                    query += ' WHERE ' + conditions.join(' AND ');
                }
            }

            if (options.orderBy) {
                Object.entries(options.orderBy).forEach(([key, order]) => {
                    query += ` ORDER BY ${key} ${order === 'desc' ? 'DESC' : 'ASC'}`;
                });
            }

            if (options.take) {
                query += ` LIMIT ${options.take}`;
            }

            this.db!.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    async exchangeRateUpsert(options: any): Promise<any> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            const { where, update, create } = options;
            const { currency } = where;

            // Try to update first
            const updateQuery = `UPDATE ExchangeRate SET rate = ?, isStable = ?, volatility = ?, lastUpdated = ? WHERE currency = ?`;
            const updateParams = [update.rate, update.isStable, update.volatility, update.lastUpdated, currency];

            this.db!.run(updateQuery, updateParams, function (err) {
                if (err) {
                    reject(err);
                } else if (this.changes > 0) {
                    // Update successful
                    resolve({ currency, ...update });
                } else {
                    // No rows updated, insert new
                    const insertQuery = `INSERT INTO ExchangeRate (currency, rate, isStable, volatility, lastUpdated) VALUES (?, ?, ?, ?, ?)`;
                    const insertParams = [currency, create.rate, create.isStable, create.volatility, create.lastUpdated];

                    this.db!.run(insertQuery, insertParams, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ currency, ...create });
                        }
                    });
                }
            });
        });
    }

    // Review operations
    async reviewFindMany(options: any = {}): Promise<any[]> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM Review';
            const params: any[] = [];

            if (options.where) {
                const conditions: string[] = [];
                Object.entries(options.where).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'object' && value.not !== null) {
                            conditions.push(`${key} IS NOT NULL`);
                        } else {
                            conditions.push(`${key} = ?`);
                            params.push(value);
                        }
                    }
                });
                if (conditions.length > 0) {
                    query += ' WHERE ' + conditions.join(' AND ');
                }
            }

            if (options.orderBy) {
                Object.entries(options.orderBy).forEach(([key, order]) => {
                    query += ` ORDER BY ${key} ${order === 'desc' ? 'DESC' : 'ASC'}`;
                });
            }

            if (options.take) {
                query += ` LIMIT ${options.take}`;
            }

            this.db!.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    // Supplier operations
    async supplierUpsert(options: any): Promise<any> {
        if (!this.db) throw new Error('Database not connected');

        const { where, update, create } = options;
        const { externalId } = where;

        return new Promise((resolve, reject) => {
            // First try to find existing supplier
            this.db!.get('SELECT * FROM Supplier WHERE externalId = ?', [externalId], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (row) {
                    // Update existing supplier
                    const updateFields = Object.keys(update).map(key => `${key} = ?`).join(', ');
                    const updateValues = Object.values(update);
                    const query = `UPDATE Supplier SET ${updateFields}, updatedAt = datetime('now') WHERE externalId = ?`;

                    this.db!.run(query, [...updateValues, externalId], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            // Return updated supplier
                            this.db!.get('SELECT * FROM Supplier WHERE externalId = ?', [externalId], (err, updatedRow) => {
                                if (err) reject(err);
                                else resolve(updatedRow);
                            });
                        }
                    });
                } else {
                    // Create new supplier
                    const createData = { ...create, id: `supp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
                    const fields = Object.keys(createData).join(', ');
                    const placeholders = Object.keys(createData).map(() => '?').join(', ');
                    const values = Object.values(createData);

                    const query = `INSERT INTO Supplier (${fields}, createdAt, updatedAt) VALUES (${placeholders}, datetime('now'), datetime('now'))`;

                    this.db!.run(query, values, function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            // Return created supplier
                            this.db!.get('SELECT * FROM Supplier WHERE id = ?', [this.lastID], (err, newRow) => {
                                if (err) reject(err);
                                else resolve(newRow);
                            });
                        }
                    });
                }
            });
        });
    }

    // User operations
    async userFindMany(options: any = {}): Promise<any[]> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM User';
            const params: any[] = [];

            if (options.where) {
                const conditions: string[] = [];
                Object.entries(options.where).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        conditions.push(`${key} = ?`);
                        params.push(value);
                    }
                });
                if (conditions.length > 0) {
                    query += ' WHERE ' + conditions.join(' AND ');
                }
            }

            this.db!.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    // Generic query method
    async query(sql: string, params: any[] = []): Promise<any[]> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            this.db!.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    // Generic execute method
    async execute(sql: string, params: any[] = []): Promise<any> {
        if (!this.db) throw new Error('Database not connected');

        return new Promise((resolve, reject) => {
            this.db!.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }
}

// Create and export a singleton instance
export const sqliteClient = new SQLiteClient();

// Export a mock Prisma-like interface
export const mockPrisma = {
    product: {
        findMany: (options: any) => sqliteClient.productFindMany(options),
        findUnique: (options: any) => sqliteClient.productFindUnique(options),
        update: (options: any) => sqliteClient.productUpdate(options),
        create: (options: any) => sqliteClient.productCreate(options),
    },
    supplier: {
        upsert: (options: any) => sqliteClient.supplierUpsert(options),
    },
    exchangeRate: {
        findMany: (options: any) => sqliteClient.exchangeRateFindMany(options),
        upsert: (options: any) => sqliteClient.exchangeRateUpsert(options),
    },
    review: {
        findMany: (options: any) => sqliteClient.reviewFindMany(options),
    },
    user: {
        findMany: (options: any) => sqliteClient.userFindMany(options),
    },
    $connect: () => sqliteClient.connect(),
    $disconnect: () => sqliteClient.disconnect(),
    $on: () => { },
    $executeRaw: () => sqliteClient.execute('', []),
    $executeRawUnsafe: () => sqliteClient.execute('', []),
    $queryRaw: () => sqliteClient.query('', []),
    $queryRawUnsafe: () => sqliteClient.query('', []),
    $runCommandRaw: () => ({}),
    $transaction: (fn: any) => fn(),
    $use: () => mockPrisma,
    $extends: () => mockPrisma,
};