import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { renderFile } from "https://deno.land/x/dejs@0.10.2/mod.ts";
import { GitHubClient, LinkedInClient, GoogleClient } from 'https://deno.land/x/denoauth@v1.0.0/mod.ts'


const app = new Application();


const GitHubObject = new GitHubClient({
    clientId: '<your_clientId>',
    clientSecret: '<your_clientSecret>',
    tokenUri: 'https://github.com/login/oauth/access_token',
    redirect: "http://localhost:3000/auth/github/callback",
    scope: "read:user"
});

const LinkedInObject = new LinkedInClient({
    clientId: '<your_clientId>',
    clientSecret: '<your_clientSecret>',
    tokenUri: 'https://api.linkedin.com/v2/me',
    redirect: 'http://localhost:3000/auth/linkedin/callback',
    scope: 'r_liteprofile'
});

const GoogleObject = new GoogleClient({
    clientId: '<your_clientId>',
    clientSecret: '<your_clientSecret>',
    tokenUri: 'https://accounts.google.com/o/oauth2/token',
    redirect: 'http://localhost:3000/auth/google/callback',
    scope: 'https://mail.google.com&access_type=offline&include_granted_scopes=true'
});


app.static("/views", "./views/login.html");


app.renderer = {
    render<T>(name: string, data: T): Promise<Deno.Reader> {
      return renderFile(name, data);
    },
  };

app.get('/login', async (c) => {
    await c.render('./login.html')
})
.start({ port: 3000 });


app.get('/gitHub', (c) => {
    c.redirect(GitHubObject.code.createLink())
})

app.get('/linkedin', (c) => {
    c.redirect(LinkedInObject.code.createLink())
})
  
app.get('/google', (c) => {
    c.redirect(GoogleObject.code.createLink())
})

app.get('/auth/github/callback', async (c) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GitHubObject.code.processAuth(c.url);
    // userProfile is an object of information given by GitHub. You can destructure the object to grab specific information
    const { name } = userProfile;
    
    return (`Hello, ${name}!`);
})

app.get('/auth/linkedin/callback', async (c) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await LinkedInObject.code.processAuth(c.url);
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    const {localizedFirstName} = userProfile;

     return (`Hello ${localizedFirstName}`);
})


app.get('/auth/google/callback', async (c) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GoogleObject.code.processAuth(c.url);
    // userProfile is an object of information given by Google. 
    //You can destructure the object to grab specific information once the app has been verified
    return (`Hello, this is where your secret page lives`);
})

console.log("http://localhost:3000/");