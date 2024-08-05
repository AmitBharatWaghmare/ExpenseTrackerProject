const form=document.getElementById('signup-form');
form.addEventListener("submit",async (event)=>{
       try{ event.preventDefault();
        const Name=document.getElementById('name').value;
        const Email=document.getElementById('email').value;
        const Password=document.getElementById('password').value;
        event.target.reset();
       
        const obj={Name,Email,Password};
        //console.log(obj);
        const response=await axios.post("http://127.0.0.1:5000/user/signup",obj);
        console.log("response",response);
        if(response.status===201){
            console.log("response");
            window.location.href="../Login/login.html"//change the page on successful login
        }
        else{
             throw new 'User already exists';
        }}
        catch(err){
          console.log(err);
        }
});
