const { response } = require('express');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/checkTokenInitialPage', (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        //select what page to redirect
        switch (decoded.typeUser) {
            //client
            case 0:
                response = {
                    "message": "success",
                    "pageRedirect": "/client/",
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token na página inicial'
                    }
                }
                res.status(200).json(response);
                break;
        
            //driver
            case 1:
                response = {
                    "message": "success",
                    "pageRedirect": "/client/",
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token na página inicial'
                    }
                }
                res.status(200).json(response);
                break;
            
            //merchant
            case 2:
                response = {
                    "message": "success",
                    "pageRedirect": "/merchant/",
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token na página inicial'
                    }
                }
                res.status(200).json(response);
                break;
            //administrator
            case 3:
                response = {
                    "message": "success",
                    "pageRedirect": "/admin/",
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token na página inicial'
                    }
                }
                res.status(200).json(response);
                break;
            //super administrator
            case 4:
                response = {
                    "message": "success",
                    "pageRedirect": "/admin/",
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token na página inicial'
                    }
                }
                res.status(200).json(response);
                break;
            default:
                response = {
                    "message": "failed",
                    "request": {
                        "type": "GET",
                        "description": "Verificar o Token na página inicial"
                    }
                }
                res.status(401).json(response);
                break;
        }
    } catch (err) {
        let response = {
            "message": "failed",
            "request": {
                "type": "GET",
                "description": "Verificar o Token na página inicial"
            }
        }
        res.status(401).json(response);
    }
    return;
});

router.get('/checkToken/:id', (req, res, next) => {
    var typeUser = req.params.id;
    var token = req.headers.authorization.split(' ')[1];
    var response;
    try {
        //verify typeUser (to be correct typeUser comming from frontend is 0(client/driver), 2(merchant) and 3(admin/superadmin))
        //only accept 0 (client/driver),2 (merchant),3 (admin/superadmin)
        if (typeUser != 0 && typeUser != 2 && typeUser != 3) {
            throw "failed";
        }
        var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        var decTypeUser = decoded.typeUser;
        var decId = decoded.id;
        //select what page to redirect
        
        switch (decTypeUser) {
            //client
            case 0:
                if (decTypeUser != typeUser) {
                    throw "failed";
                }
                response = {
                    "message": "success",
                    "typeUser": decTypeUser,
                    "id" : decId,
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token numa Página Reservada'
                    }
                }
                res.status(200).json(response);
                break;
        
            //driver
            case 1:
                //plus 1, because driver comming from frontend 0
                if (decTypeUser != (parseInt(typeUser)+1)) {
                    throw "failed";
                }
                response = {
                    "message": "success",
                    "typeUser": decTypeUser,
                    "id" : decId,
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token numa Página Reservada'
                    }
                }
                res.status(200).json(response);
                break;
            
            //merchant
            case 2:
                if (decTypeUser != typeUser) {
                    throw "failed";
                }
                response = {
                    "message": "success",
                    "typeUser": decTypeUser,
                    "id" : decId,
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token numa Página Reservada'
                    }
                }
                res.status(200).json(response);
                break;
            //administrator
            case 3:
                if (decTypeUser != typeUser) {
                    throw "failed";
                }
                response = {
                    "message": "success",
                    "typeUser": decTypeUser,
                    "id" : decId,
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token numa Página Reservada'
                    }
                }
                res.status(200).json(response);
                break;
            case 4:
                //plus 1, because superadministrator comming from frontend 3
                if (decTypeUser != (parseInt(typeUser)+1)) {
                    throw "failed";
                }
                response = {
                    "message": "success",
                    "typeUser": decTypeUser,
                    "id" : decId,
                    "request": {
                        "type": 'GET',
                        "description": 'Verificar o Token numa Página Reservada'
                    }
                }
                res.status(200).json(response);
                break;
            default:
                response = {
                    "message": "failed",
                    "request": {
                        "type": "GET",
                        "description": "Verificar o Token numa Página Reservada"
                    }
                }
                res.status(401).json(response);
                break;
        }
    } catch (err) {
        let response = {
            "message": "failed",
            "request": {
                "type": "GET",
                "description": "Verificar o Token numa Página Reservada"
            }
        }
        res.status(401).json(response);
    }
    return;
});

router.get('/checkMerchantChecked/:id', (req, res, next) => {

    const tokenUnsplited = req.headers.authorization;
    if (!tokenUnsplited) {
        let response = {
            "message": "failed",
            "description": "A empresa ainda não foi verificada ou não pode fazer esta função"
        };
        res.status(401).json(response);
    } else {
        const token = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, process.env.PRIVATE_KEY);

        if (decoded.typeUser == '2') {
            var idUser = decoded.id;

            function checkCanWorkSQL() {
                return new Promise ((resolve, reject) => {
                    var db = require("../sql").db();
                    var sql = `SELECT canWork FROM merchant WHERE idUser = ?`;
                    db.get(sql, [idUser], function (err, row) {
                    }, function (err, row) {
                        db.close();
                        if (err) {
                            reject(err);
                        } else if (row){
                            resolve(row);
                        } else {
                            reject();
                        }
                    });
                });
            }

            var varErr;
    
            checkCanWorkSQL().then(function (data) {
                if (!data) {
                    varErr = 0;
                } else if (data.canWork != 1) {
                    varErr = 1;
                } else {
                    varErr = 2;
                } 
            }).catch(function () {
                varErr = 3;
            }).finally(function () {
                if (varErr == '2') {
                    let response = {
                        "success": "success",
                        "description": "A empresa pode trabalhar"
                    };
                    res.status(200).json(response);
                } else {
                    let response = {
                        "message": "failed",
                        "description": "A empresa ainda não foi verificada ou não pode fazer esta função"
                    };
                    res.status(401).json(response);
                }
            });
        } else {
            let response = {
                "message": "failed",
                "description": "A empresa ainda não foi verificada ou não pode fazer esta função"
            };
            res.status(401).json(response);
        }
    }


    return;
});

module.exports = router;