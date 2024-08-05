const Sib = require(`sib-api-v3-sdk`);
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ForgotPassword = require("../models/forgetPassword");
async function forgotpassword(req, res, next) {
    try {
        const { email } = req.body;
        console.log("emaop");
        const user = await User.findOne({ email });
        console.log(user._id);
        try {
            if (user) {
                const id = uuid.v4();
                const newForgotPassword = new ForgotPassword({ id, active: true });
                await newForgotPassword.save();
                const client = Sib.ApiClient.instance;
                const apiKey = client.authentications['api-key'];
                apiKey.apiKey = "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";
                const apiInstance = new Sib.TransactionalEmailsApi();

                const sender = {
                    email: 'waghmareamit738@gmail.com'
                };

                // Send transactional email
                await apiInstance.sendTransacEmail({
                    sender,
                    to: [{ email: email }],
                    subject: "Reset your password",
                    textContent: "Click here to reset your password",
                    htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
                });

                // Send success response
                return res.status(200).json({ message: 'Link to reset password sent', success: true });
            }
            else {
                throw new Error('User doesnt exist');
            }
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to send reset password email', success: false });
    }
}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    ForgotPassword.findOne( id ).then(forgotpasswordrequest => {
        if(forgotpassword){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="http://localhost:3000/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}


const updatepassword  = async(req , res , next) =>{
    try{
        const {newpassword} = req.query;
        const {resetpasswordid} = req.params;
        let forgotpasswordrequests = await ForgotPassword.findOne({where:{id:resetpasswordid}});
        let user = await User.findOne({where:{id : forgotpasswordrequests.SignUpUserId}});
        const saltRounds =10;
        const hashedPassword = await bcrypt.hash(newpassword,saltRounds);
        await user.update({password:hashedPassword});
        console.log("Succesfully updated")
        return res.status(201).json({ message: 'Successfully updated the new password', success: true });
        
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
    }

    module.exports = {
        forgotpassword,
        updatepassword,
        resetpassword
    }