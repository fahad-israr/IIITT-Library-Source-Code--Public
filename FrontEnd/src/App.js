import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';
import {ToastContainer} from "react-toastify";
import './App.css'
const LoginIndex = Loadable({
    loader: () => import('./components/login/Index'),
    loading: () => <div> </div>,
});
const HomeIndex = Loadable({
    loader: () => import('./components/home/Index'),
    loading: () => <div> </div>,
});

const SideBar = Loadable({
    loader: () => import('./components/sideBar/Index'),
    loading: () => <div> </div>,
});
const NavBar = Loadable({
    loader: () => import('./components/navbar/Index'),
    loading: () => <div> </div>,
});

const BooksIndex = Loadable({
    loader: () => import('./components/books/Index'),
    loading: () => <div> </div>,
});
const BooksInfoIndex = Loadable({
    loader: () => import('./components/booksinfo/Index'),
    loading: () => <div> </div>,
});
const StudentsInfoIndex = Loadable({
    loader: () => import('./components/studentsinfo/Index'),
    loading: () => <div> </div>,
});

const ReturnIndex = Loadable({
    loader: () => import('./components/return/Index'),
    loading: () => <div> </div>,
});
const StudentsIndex = Loadable({
    loader: () => import('./components/students/Index'),
    loading: () => <div> </div>,
});


const NotFound = Loadable({
    loader: () => import('./components/notfound/Index'),
    loading: () => <div> </div>,
});





class App extends Component {
    constructor() {
        super();
        this.state = {
            isAuthenticated: false
        };
        
        this.handleUpdate = this.handleUpdate.bind(this)
    }

 

    handleUpdate(isAuthenticated) {
        this.setState({isAuthenticated},()=>{localStorage.setItem('dFauth',JSON.stringify({isAuthenticated}))});
        
    }



    
componentDidMount(){
    if(localStorage.getItem('dFauth')){
                let p=localStorage.getItem('dFauth');
                let z=JSON.parse(p);
                this.setState({isAuthenticated:z.isAuthenticated})
            }
                
}


                                

    render() {
        return (
            <BrowserRouter history={window.history} basename={process.env.PUBLIC_URL}>
            {this.state.isAuthenticated ?
                <div>
                    <NavBar updateRoutes={this.handleUpdate} />
                    <SideBar/>
                    <Switch>
                        
                    <Route exact path="/" component={HomeIndex} />
                    <Route path="/home" component={HomeIndex} />
                    <Route path="/books" component={BooksIndex} />
                    <Route exact path="/book" component={BooksIndex} />
                    <Route path="/return" component={ReturnIndex} />
                    <Route path="/students" component={StudentsIndex} />
                    <Route path="/book/*" component={BooksInfoIndex} />
                    <Route path="/student/*" component={StudentsInfoIndex} />
                     <Route exact path="*" component={NotFound} />
                    </Switch>
                    
                     <ToastContainer  className='toast-container' toastClassName="darkToast"  progressClassName="progressbar"  />
                </div>
                :
                <Switch>

                <Route path="/login" render={ () => <LoginIndex updateRoutes={this.handleUpdate}/> } />
                <Route exact path="/" render={ () => <LoginIndex updateRoutes={this.handleUpdate}/> } />
                <Route exact path="*" component={NotFound} />   
                </Switch>
            }
            </BrowserRouter>
        );
    }
}
//#test
export default App;
