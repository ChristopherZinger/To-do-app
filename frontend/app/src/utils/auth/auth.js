
import axios from 'axios';



class AuthEmitter {
    constructor() {
        this.events = {};
    }

    on(type, listener) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    }

    emmit(type) {
        if (this.events[type]) {
            this.events[type].forEach(fn => fn());
            return;
        }
        throw Error(`[auth.js] AuthEmitter. There is no "${type}" event on the list.`)
    }
}


class Auth {
    constructor() {
        this.isAuth = false;
        this.timer = null;
    }

    login(accessToken, tokenExpTime) {
        axios.defaults.headers.common['authorization'] = `AUTH ${accessToken}`;
        // emit login if state has changed
        if (!this.isAuth) authEmitter.emmit('login')

        // try to get new token 55 sec before old one expires
        this.timer = window.setTimeout(function () {
            getUpdatedAccessToken.call(this)
        }.bind(this), ((tokenExpTime * 60 * 1000) - 55000))

        async function getUpdatedAccessToken(attemptNr) {
            if (!attemptNr) attemptNr = 1;
            console.log("[auth.js] attempt to update access token . try: ", attemptNr);

            try {
                const res = await axios.get('/update-access-token')
                const { accessToken, expirationPeriod } = res.data.auth;
                this.login(accessToken, expirationPeriod)
            } catch (err) {
                console.log(err)
                // if failed try 4 more times 
                if (attemptNr + 1 < 5) {
                    getUpdatedAccessToken.call(this, attemptNr + 1)
                } else {

                    this.logout()
                }
                return;
            }
        }
    }


    logout() {
        console.log('[auth.js] logout()')
        if (this.timer) window.clearTimeout(this.timer);
        authEmitter.emmit('logout')
        axios.defaults.headers.common['authorization'] = 'AUTH TOKEN';

    }
}

const auth = new Auth();
const authEmitter = new AuthEmitter();

authEmitter.on('login', () => {
    auth.isAuth = true;
})

authEmitter.on('logout', () => {
    auth.isAuth = false;
})



export {
    auth,
    authEmitter,
}



