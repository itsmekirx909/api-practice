const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const dburi = 'mongodb+srv://musab:musab@cluster1.runm9lr.mongodb.net/testproject'
const mongoose = require('mongoose')
const usermodel = require('./models/user')
const bcrypt = require('bcryptjs')


mongoose.connect(dburi)
.then((s)=>{})
.catch((e)=>{console.log(e)})

app.use(express.json())


// single user get 63d8c32fee9d89dc98965f34
app.get('/user/:userid', (req, res)=>{
const {userid} = req.params

//finds only 1 and gets the first one if all have same
    // usermodel.findOne( {_id: userid}, (error, data)=>{
    //     if(error){
    //         res.json({
    //             message: 'Database Error',
    //             status: false
    //         })
    //     }else{
    //         if(!data){
    //             res.json({
    //                 message: 'No such user found',
    //                 status: false
    //             })              
    //         }else{
    //             res.json({
    //                 message: 'user data get',
    //                 status: true,
    //                 data: data
    //             })
    //         }
    //     }
    // })

    //or

//finds only using id no object required
    usermodel.findById( userid, (error, data)=>{
        if(error){
            res.json({
                message: 'Database Error',
                status: false
            })
        }else{
            if(!data){
                res.json({
                    message: 'No such user found',
                    status: false
                })              
            }else{
                res.json({
                    message: 'user data get',
                    status: true,
                    data: data
                })
            }
        }
    })   


})


//all users with same thing get
app.get('/userlastname', (req, res)=>{
    //finds all
    usermodel.find( {last_name: 'mohiuddin'}, (error, data)=>{
        if(error){
            res.json({
                message: 'Database Error',
                status: false
            })
        }else{
            if(!data){
                res.json({
                    message: 'No such user found',
                    status: false
                })              
            }else{
                res.json({
                    message: 'user data get',
                    status: true,
                    data: data
                })
            }
        }
    })
})


//all users
app.get('/allusers', (req, res)=>{
    //finds all
    usermodel.find( {}, (error, data)=>{
        if(error){
            res.json({
                message: 'Database Error',
                status: false
            })
        }else{
            if(!data){
                res.json({
                    message: 'No such user found',
                    status: false
                })              
            }else{
                res.json({
                    message: 'user data get',
                    status: true,
                    data: data
                })
            }
        }
    })
})


// user creation
app.post('/user', (req, res)=>{
    const bodydata = req.body

if(!bodydata.firstName || !bodydata.lastName || !bodydata.data || !bodydata.email){
res.json({
    message: 'Required fields are missing',
    status: false
})
return
}

    const userdata = {
        first_name: bodydata.firstName,
        last_name: bodydata.lastName,
        data: bodydata.data,
        email: bodydata.email,
    }

    usermodel.create(userdata, (error, data)=>{

// error is incase our data isnt stored in database (the error will be in boolean)
if(error){

res.json({
    message: 'Error from database',
    status: false
})
}else{
    res.send({
        message: 'User Created',
        status: true,
        data: userdata
    })
}

    })

})


// 1 signup with 1 email  (use this to signup users) basically signup
app.post('/usersignup', async (req, res)=>{
    const bodydata = req.body

if(!bodydata.firstName || !bodydata.lastName || !bodydata.data || !bodydata.email){
res.json({
    message: 'Required fields are missing',
    status: false
})
return
}



const hashedpw = await bcrypt.hash(bodydata.password, 10)

    const userdata = {
        first_name: bodydata.firstName,
        last_name: bodydata.lastName,
        data: bodydata.data,
        email: bodydata.email,
        password: hashedpw
}

    usermodel.findOne({email: userdata.email}, (error, data)=>{
        if(data){
            res.json({
                message: 'Email is already in use',
                status: false
            })
            return

        }else{
            if(error){

                res.json({
                    message: 'Error from database',
                    status: false
                })
            }

            else{

                usermodel.create(userdata, (error, data)=>{

                    // error is incase our data isnt stored in database (the error will be in boolean)
                    if(error){
                    
                    res.json({
                        message: 'Error from database',
                        status: false
                    })
                    }else{
                        res.send({
                            message: 'User Created',
                            status: true,
                            data: userdata
                        })
                    }
                    
                        })
            }

        }
    })






})

// login   (we use post because we want to get the req.body and get method doesnt get req)
app.post('/userlogin', (req,res)=>{

const {email, password} = req.body

if(!email, !password){
    res.json({
        message: 'Fields are missing',
        status: false
    })
    return;
}


usermodel.findOne({ email: email}, async (error, data)=>{
    if(error){
        res.json({
            message: 'Database error',
            status: false
        })
    }else{
        if(!data){
            res.json({
                message: 'Invalid input',
                status: false
            })
            return;
        }

const comparedpass = await bcrypt.compare(password, data.password)

if(comparedpass){
    
    res.json({
        message: 'User logged in',
        status: true,
        data: data
    })

}else{
    res.json({
        message: 'Invalid input',
        status: false
    })
}

    }
})

})


// delete user
app.delete('/userdelete/:id', (req, res)=>{
    const {id} = req.params

usermodel.findByIdAndDelete({_id: id}, (error, data)=>{
    if(error){
        res.json({
            message: 'Database error',
            status: false
        })
    }else{
        if(!data){
            res.json({
                message: 'No user found',
                status: false
            })
        }else{
            res.json({
                message: 'User deleted',
                status: true,
                data: data
            })
        }
    }
})

})

app.listen(PORT, ()=>{
    console.log('success')
})