if(process.env.NODE_ENV === 'dev'){
    require('dotenv').config({ path: './.env.development' })
}else{
    require('dotenv').config({ path: './.env.production' })
}
module.exports = {

    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'db_cachaionline',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    //Almacenar seeders ejecutados en un archivo json
    //seederStorage: "json",
    //Archivo donde se guardara el json
    //seederStoragePath: "executedSeeds.json",
    //Almacenar seeders ejecutandos en una base de datos.
    seederStorage: "sequelize",
    //Tabla donde se almacenarán los registros
    seederStorageTableName: "sequelize_seeds",
    //Almacenar migraciones ejecutandas en una base de datos.
    migrationStorage: "sequelize",
    //Tabla donde se almacenarán los registros
    migrationStorageTableName: "sequelize_migrations",
    define: { 
        timestamps: true
    },
    logging: process.env.NODE_ENV === 'dev' ? false : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: true
    },
    timezone: '-04:00'
}