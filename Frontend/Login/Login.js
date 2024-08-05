const form=document.getElementById('login-form');
form.addEventListener("submit",async (event)=>{
    try{ event.preventDefault();
       const Email=document.getElementById('Email').value;
        const Password=document.getElementById('Password').value;
        event.target.reset();
        const myobj={Email,Password};
        
        const response=await axios.post("http://127.0.0.1:5000/user/login",myobj);
        localStorage.setItem('token',response.data.token);
        if(response.status===200){
            window.location.href="../Expense/Expense.html";
        }
        else{
          throw new Error(response.data.message);
        }
    }
    catch(err){
        console.log(err);
    }
});
function forgotpassword() {
    window.location.href = "../ForgetPassword/forget.html"
}
function signup() {
    window.location.href = "../Signup/signup.html"
}
