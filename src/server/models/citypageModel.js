import mysql from 'mysql';
import webConfig from './../../../webConfig';

const host = 'localhost';
const user = 'root';
const pswd = '';
const dbname = 'work';

// config db ====================================
const pool = mysql.createPool({
    host: host,
    user: user,
    password: pswd,
    port: '3306',
    database: dbname
});
const COLUMNS = {
    visitcities_column: ['id', 'imgsrc', 'city_title', 'label_before', 'label_after'],
    popularplaces_column: ['id', 'price', 'imgsrc', 'place_name', 'avatar_imgsrc', 'heart', 'account_group', 'door_simple', 'bed_double'],
    blogcategories_column: ['id', 'title', 'imgsrc'],
    bloglist_column: ['id', 'imgsrc', 'label_befor', 'label_after', 'title', 'summary'],
};

exports.getcitypagedata = async (req , res) => {
    let retVal = {
        popular_place_list: [],
        selected_citydata: null
    }
    let queryString = '';
    let cityID = req.body.cityID;
    if (cityID) {
        queryString = 'SELECT * FROM visitcities WHERE id="' + cityID + '"';
        await pool.query(queryString, function (err, rows, fields) {
            if (err) throw err;
    
            if (rows.length > 0) {
                rows.map(entry => {
                    const e = {};
                    COLUMNS.visitcities_column.forEach(c => {
                        if (c == 'imgsrc') {
                            e[c] = webConfig.siteURL + entry[c];
                        }
                        else
                            e[c] = entry[c];
                    });
                    retVal.selected_citydata = e;
                })
            }
        });
    }
    queryString = 'SELECT * FROM popular_places';
    await pool.query(queryString, function (err, rows, fields) {
        if (err) throw err;

        if (rows.length > 0) {
            rows.map(entry => {
                const e = {};
                COLUMNS.popularplaces_column.forEach(c => {
                    if (c == 'imgsrc' || c == 'avatar_imgsrc') {
                        e[c] = webConfig.siteURL + entry[c];
                    }
                    else
                        e[c] = entry[c];
                });
                retVal.popular_place_list.push(e);
            })
        } else {
            retVal.popular_place_list = []
        }
        res.json(retVal);
    });
}