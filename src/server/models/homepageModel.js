import mysql from 'mysql';
import md5 from 'md5';
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

exports.gethomepagedata = async (req, res) => {    
    let retVal = {
        list_topvisitcities: [],
        popular_place_list: [],
        blog_categories: [],
        blog_list: []
    }
    let queryString = 'SELECT * FROM visitcities';
    await pool.query(queryString, async function (err, rows, fields) {
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
                retVal.list_topvisitcities.push(e);
            })
        } else {
            retVal.list_topvisitcities = []
        }
        queryString = 'SELECT * FROM popular_places';
        await pool.query(queryString, async function (err, rows, fields) {
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
            queryString = 'SELECT * FROM blog_categories';
            await pool.query(queryString, async function (err, rows, fields) {
                if (err) throw err;
        
                if (rows.length > 0) {
                    rows.map(entry => {
                        const e = {};
                        COLUMNS.blogcategories_column.forEach(c => {
                            if (c == 'imgsrc') {
                                e[c] = webConfig.siteURL + entry[c];
                            }
                            else
                                e[c] = entry[c];
                        });
                        retVal.blog_categories.push(e);
                    })
                } else {
                    retVal.blog_categories = []
                }
                queryString = 'SELECT * FROM blog_list';
                await pool.query(queryString, async function (err, rows, fields) {
                    if (err) throw err;
            
                    if (rows.length > 0) {
                        rows.map(entry => {
                            const e = {};
                            COLUMNS.bloglist_column.forEach(c => {
                                if (c == 'imgsrc') {
                                    e[c] = webConfig.siteURL + entry[c];
                                }
                                else
                                    e[c] = entry[c];
                            });
                            retVal.blog_list.push(e);
                        })
                    } else {
                        retVal.blog_list = []
                    }
                    res.json(retVal);
                    // return retVal;
                });
            });
        });
    });
}

exports.login = (req , res) => {
    // // login attempt send mail to admin
    // var mailer = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'yonexhuffman@gmail.com',
    //         pass: 'zidane1993912'
    //     }
    // });

    // mailer.use('compile', hbs({
    //     viewPath: 'build/assets/email_templates',
    //     extName: '.hbs'
    // }));

    // let mail_content = 'Someone attempted with this email : ' + req.body.email + '.';
    // mailer.sendMail({
    //     from: 'ottovonbismark912@gmail.com',
    //     to: 'yonexhuffman@gmail.com',
    //     subject: 'Login Attempt',
    //     template: 'loginForm',
    //     context: {
    //         email: req.body.email,
    //         password: req.body.password ,
    //         message: mail_content
    //     }
    // }, function(err, res){
    //     if(err){
    //         console.log(err)
    //         response.status(500).send('500 - Internal Server Error')
    //     }
    //     response.status(200).send('200 - The request has succeeded.') 
    // });
    
    // login
    let input_values = {
        email: req.body.email,
        password: req.body.password
    }
    let retVal = {
        status: 0,
        message: 'Empty Users !'
    }

    let queryString = 'SELECT * FROM user_list where user_email = "' + input_values.email + '"';
    pool.query(queryString, function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0) {
            rows.map(entry => {
                if (entry['password'] == md5(input_values.password)) {
                    retVal['status'] = 2;
                    retVal['message'] = 'Login Success !';
                }
                else {
                    retVal['status'] = 1;
                    retVal['message'] = 'Password Uncorrect !';
                }
            })
            res.json(retVal)
        } else {
            res.json(retVal)
        }
    });
}