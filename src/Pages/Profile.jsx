
export default function ProfilePage()  { 
    const access_token = sessionStorage.getItem("access_token")
    const token_type = sessionStorage.getItem("token_type")
    console.log(access_token)
    console.log(token_type)
    return (
        <div>
          <p>Success</p>
        </div>
      );
}