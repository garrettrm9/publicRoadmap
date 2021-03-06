import React, { Component } from "react";
// import {
//   // Alignment,
//   Button,
//   // Classes,
//   // H5,
//   // Navbar,
//   Icon,
//   // NavbarDivider,
//   // NavbarGroup,
//   // NavbarHeading,
//   // Switch,
//   // Overlay,
//   Dialog
// } from "@blueprintjs/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
  // MemoryRouter
} from "react-router-dom";
import Home from "./Components/screens/home";
import CompanyList from "./Components/screens/companyList";
import CompanyProducts from "./Components/companies/companyProducts";
import ProductList from "./Components/screens/productList";
import ProductFeatures from "./Components/products/productFeatures";
import Login from "./Components/screens/login";
import Register from "./Components/auth/register";
import NavBar from "./Components/navBar/navBar";
import AddFeature from "./Components/screens/addFeature";
import ResultsBox from "./Components/screens/results/resultsBox";
import "./App.css";
import axios from "axios";
import TokenService from "./Services/tokenService";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      companies: [],
      unfilteredFeatureList: [],
      isLoggedIn: false,
      user: [],
      votes: [],
      follows: [],
      companyProducts: [],
      productFeatures: [],
      searchResults: [],
      navigateToResults: false
    };
    this.getAllCompanies = this.getAllCompanies.bind(this);
    this.getCompanyProducts = this.getCompanyProducts.bind(this);
    // this.getAllActivities = this.getAllActivities.bind(this);
    this.getCompanyName = this.getCompanyName.bind(this);
    this.getVoteCount = this.getVoteCount.bind(this);
    this.getUserActivities = this.getUserActivities.bind(this);
    this.getAllProductFeatures = this.getAllProductFeatures.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getAllFeatures = this.getAllFeatures.bind(this);
    this.addFeature = this.addFeature.bind(this);
    this.newActivity = this.newActivity.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.sortActivities = this.sortActivities.bind(this);
    this.grabSearchResults = this.grabSearchResults.bind(this);
    // this.getInfo = this.getInfo.bind(this);
  }

  // ----------------------------COMPANIES----------------------------

  getAllCompanies() {
    axios({
      url: "http://localhost:8080/companies"
    })
      .then(response => {
        const companies = response.data.map(company => {
          company.category = "company";
          return company;
        });
        // console.log("getAllCompanies", companies);
        this.setState({ companies: companies });
      })
      .catch(err => console.log(`getAllCompanies err: ${err}`));
  }

  getCompanyProducts(company) {
    console.log("getCompanyProducts company", company);
    axios({
      url: `http://localhost:8080/companies/${company}/products`
    })
      .then(response => {
        // console.log("getCompanyProducts resp", response.data);
        this.setState({ companyProducts: response.data });
      })
      .catch(err => console.log(`getCompanyProducts err: ${err}`));
  }

  // ----------------------------PRODUCTS----------------------------

  getAllProducts() {
    // console.log("getAllProducts str", str);
    axios({
      url: "http://localhost:8080/products"
    })
      .then(response => {
        const products = response.data.map(product => {
          product.category = "product";
          return product;
        });
        // console.log("getAllProducts", products);
        this.setState({ products: products });
      })
      .catch(err => console.log(`getAllProducts err: ${err}`));
  }

  // ----------------------------ACTIVITIES----------------------------

  sortActivities(activities) {
    // console.log("sortActivities activities", activities);
    const votes = [];
    const follows = [];
    activities.map(activity => {
      if (activity.type === "vote") {
        votes.push(activity);
      } else if (activity.type === "follow") {
        follows.push(activity);
      }
      return activity;
    });
    this.setState({ votes: votes, follows: follows });
    // console.log("sortActivities votes", votes);
    // console.log("sortActivities follows", follows);
  }

  // getAllActivities() {
  //   axios({
  //     url: "http://localhost:8080/activities"
  //   })
  //     .then(response => {
  //       const activities = response.data;
  //       // console.log("getAllActivities resp", activities);
  //       this.sortActivities(activities);
  //     })
  //     .catch(err => console.log(`getAllActivities err: ${err}`));
  // }

  newActivity(featureID, userEmail, type) {
    axios({
      url: `http://localhost:8080/activities/${featureID}`,
      method: "POST",
      data: {
        type: type,
        user_email: userEmail
      }
    })
      .then(response => {
        // this.getAllActivities();
        this.getAllFeatures();
        this.getUserActivities();
      })
      .catch(err => console.log(`newActivity err: ${err}`));
  }

  deleteActivity(featureID, userEmail, type) {
    axios({
      url: `http://localhost:8080/activities/${featureID}`,
      method: "DELETE",
      data: {
        type: type,
        user_email: userEmail
      }
    })
      .then(response => {
        // this.getAllActivities();
        this.getUserActivities();
        this.getAllFeatures();
      })
      .catch(err => console.log(`deleteActivity err: ${err}`));
  }

  getCompanyName(features) {
    // console.log("getCompanyName features", features);
    const unfilteredFeatureList = features.map(feature => {
      axios({
        url: `http://localhost:8080/activities/${feature.product_name}/company`
      })
        .then(response => {
          const companyName = response.data[0].company_name;
          // console.log("getCompanyName companyName", companyName);
          feature.company_name = companyName;
        })
        .catch(err => console.log(`getCompanyName err: ${err}`));
      return feature;
    });
    this.setState({ unfilteredFeatureList: unfilteredFeatureList });
  }

  getVoteCount(features) {
    // console.log("getVoteCount features", features);
    const unfilteredFeatureList = features.map(feature => {
      feature.category = "feature";
      axios({
        url: `http://localhost:8080/activities/${feature.id}/votes`
      })
        .then(response => {
          // console.log("getVoteCount resp", response.data);
          feature.votes = response.data;
        })
        .catch(err => console.log(`getVoteCount err: ${err}`));
      return feature;
    });
    // console.log("getVoteCount", unfilteredFeatureList);
    // this.setState({ unfilteredFeatureList: unfilteredFeatureList });
    this.getCompanyName(unfilteredFeatureList);
  }

  getUserActivities() {
    // console.log("getUserActivities user", this.state.user);
    axios({
      url: `http://localhost:8080/activities/${this.state.user.email}`
    })
      .then(response => {
        // console.log("getUserActivities resp", response.data);
        this.sortActivities(response.data);
      })
      .catch(err => console.log(`getUserActivities err: ${err}`));
  }

  // ----------------------------FEATURES----------------------------

  getAllFeatures() {
    // console.log("getAllProducts str", str);
    axios({
      url: "http://localhost:8080/features"
    })
      .then(response => {
        // const features = response.data;
        // features.map(feature => {
        //   // console.log("feature", feature)
        //   const votesFilteredArr = [];
        //   const votes = this.state.votes;
        //   votes.map(vote => {
        //     // console.log("vote", vote)
        //     const voteFeatureID = JSON.stringify(vote.feature_id);
        //     // console.log("vote.feature_id", typeof voteFeatureID)
        //     // console.log("feature.id", typeof feature.id)

        //     if (voteFeatureID === feature.id) {
        //       votesFilteredArr.push(vote);
        //       // console.log("yes")
        //     }
        //     // console.log("getAllFeatures votesFilteredArr", votesFilteredArr)
        //     const length = votesFilteredArr.length;
        //     feature.votes = length;
        //   });
        this.getVoteCount(response.data);
        // })
        // console.log("getAllFeatures features", features)
        // this.setState({ unfilteredFeatureList: features });
        // this.sortByVotes();
      })
      .catch(err => console.log(`getAllFeatures err: ${err}`));
  }

  getAllProductFeatures(name) {
    // console.log("getAllProductFeatures name", name);
    axios({
      url: `http://localhost:8080/products/${name}/features`
    })
      .then(response => {
        this.setState({ productFeatures: response.data });
        // console.log("getAllProductFeatures resp", response.data);
      })
      .catch(err => console.log(`getAllProductFeatures err: ${err}`));
  }

  addFeature(data) {
    axios({
      url: "http://localhost:8080/features",
      method: "POST",
      data: data
    })
      .then(response => {
        // this.getAllActivities();
        this.getUserActivities();
        this.getAllFeatures();
      })
      .catch(err => console.log(`addFeature err: ${err}`));
  }

  // ----------------------------AUTH----------------------------

  login(email, password) {
    axios({
      url: "http://localhost:8080/users/login",
      method: "POST",
      data: { email: email, password: password }
    })
      .then(response => {
        // this.getAllCompanies();
        // this.getAllProducts();
        // this.getAllFeatures();
        TokenService.save(response.data.token);
        // console.log("login response", response.data);
        this.setState({ isLoggedIn: true, user: response.data.user });
        // this.getAllProducts("login");
        // this.getAllFeatures("login");
        this.getUserActivities();
      })
      .catch(err => console.log("login err", err));
  }

  register(email, password) {
    axios({
      url: "http://localhost:8080/users",
      method: "POST",
      data: { email: email, password: password }
    })
      .then(response => {
        // this.getAllFeatures();
        TokenService.save(response.data.token);
        // console.log("register response", response.data);
        this.setState({ isLoggedIn: true, user: response.data.user });
        // this.getAllProducts("register");
        // this.getAllFeatures("register");
      })
      .catch(err => console.log("register err", err));
  }

  logout() {
    TokenService.destroy();
    this.setState({
      // products: [],
      // unfilteredFeatureList: [],
      isLoggedIn: false,
      user: []
    });
    // console.log("logged out user?", this.state.user);
  }

  // ----------------------------MISC.----------------------------

  grabSearchResults(results) {
    // console.log("grabSearchResults results", results);
    this.setState({ searchResults: results, navigateToResults: true });
  }

  // getInfo(category, name) {
  //   // console.log("getInfo category", category);
  //   // console.log("getInfo name", name);
  //   axios({
  //     url: `http://localhost:8080/activities/search/${category}/${name}`
  //   })
  //     .then(response => {
  //       console.log("getInfo", response.data);
  //       // this.setState({ searchResults: response.data });
  //     })
  //     .catch(err => console.log("getInfo err", err));
  // }

  componentDidMount() {
    this.getAllCompanies();
    this.getAllProducts();
    this.getAllFeatures();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     this.state.unfilteredFeatureList.length !==
  //       prevState.unfilteredFeatureList.length ||
  //     this.state.products.length !== prevState.products.length ||
  //     this.state.companies.length !== prevState.companies.length ||
  //     this.state.votes.length !== prevState.votes.length ||
  //     this.state.follows.length !== prevState.follows.length
  //   ) {
  //     this.getAllCompanies();
  //     this.getAllProducts();
  //     this.getAllActivities();
  //     this.getAllFeatures();
  //   }
  // }

  render() {
    if (this.state.isLoggedIn === true) {
      return (
        <div>
          <Router>
            <div>
              <NavBar
                addFeature={this.addFeature}
                logout={this.logout}
                grabSearchResults={this.grabSearchResults}
                // getInfo={this.getInfo}
                user={this.state.user}
                products={this.state.products}
                companies={this.state.companies}
                votes={this.state.votes}
                follows={this.state.follows}
                unfilteredFeatureList={this.state.unfilteredFeatureList}
                navigateToResults={this.state.navigateToResults}
                // searchResults={this.state.searchResults}
              />
              <Switch>
                <Route
                  exact
                  path="/product/:name"
                  render={props => (
                    <ProductFeatures
                      {...props}
                      productFeatures={this.state.productFeatures}
                      getAllProductFeatures={this.getAllProductFeatures}
                      products={this.state.products}
                      votes={this.state.votes}
                      follows={this.state.follows}
                      user={this.state.user}
                      newActivity={this.newActivity}
                      deleteActivity={this.deleteActivity}
                    />
                  )}
                />
                <Route
                  exact
                  path="/product"
                  render={props => (
                    <ProductList
                      {...props}
                      products={this.state.products}
                      unfilteredFeatureList={this.state.unfilteredFeatureList}
                    />
                  )}
                />

                <Route
                  exact
                  path="/company/:name"
                  render={props => (
                    <CompanyProducts
                      {...props}
                      // companies={this.state.companies}
                      // products={this.state.products}
                      companyProducts={this.state.companyProducts}
                      getCompanyProducts={this.getCompanyProducts}
                    />
                  )}
                />

                <Route
                  exact
                  path="/company"
                  render={props => (
                    <CompanyList
                      {...props}
                      companies={this.state.companies}
                      user={this.state.user}
                    />
                  )}
                />
                <Route
                  exact
                  path="/addFeature"
                  render={props => (
                    <AddFeature
                      {...props}
                      addFeature={this.addFeature}
                      products={this.state.products}
                      user={this.state.user}
                    />
                  )}
                />
                <Route
                  exact
                  path="/results"
                  render={props => (
                    <ResultsBox
                      {...props}
                      searchResults={this.state.searchResults}
                    />
                  )}
                />
                <Route
                  exact
                  path="/home"
                  render={props => (
                    <Home
                      {...props}
                      getAllFeatures={this.getAllFeatures}
                      addFeature={this.addFeature}
                      getUserActivities={this.getUserActivities}
                      newActivity={this.newActivity}
                      deleteActivity={this.deleteActivity}
                      products={this.state.products}
                      unfilteredFeatureList={this.state.unfilteredFeatureList}
                      user={this.state.user}
                      votes={this.state.votes}
                      follows={this.state.follows}
                    />
                  )}
                />
                <Route path="/" render={() => <Redirect to="/home" />} />
              </Switch>
            </div>
          </Router>
        </div>
      );
    } else if (this.state.isLoggedIn === false) {
      return (
        <div className="loginScreen">
          <Router>
            <Switch>
              <Route
                exact
                path="/register"
                render={props => <Register register={this.register} />}
              />
              <Route
                exact
                path="/login"
                render={props => <Login login={this.login} />}
              />
              <Route path="/" render={() => <Redirect to="/login" />} />
            </Switch>
          </Router>
        </div>
      );
    }
  }
}

export default App;

// editFeature(
//   id,
//   name,
//   // author,
//   purpose,
//   userStory,
//   acceptanceCriteria,
//   businessValue,
//   wireframes,
//   attachments,
//   votes,
//   dateLastUpdated,
//   productName,
//   userEmail
// ) {
//   // console.log("editFeature id", id);
//   // console.log("editFeature name", name);
//   // console.log("editFeature author", author);
//   // console.log("editFeature purpose", purpose);
//   // console.log("editFeature userStory", userStory);
//   // console.log("editFeature acceptanceCriteria", acceptanceCriteria);
//   // console.log("editFeature businessValue", businessValue);
//   // console.log("editFeature wireframes", wireframes);
//   // console.log("editFeature attachments", attachments);
//   // console.log("editFeature votes", votes);
//   axios({
//     url: `http://localhost:8080/features/${id}`,
//     method: "PUT",
//     data: {
//       name: name,
//       // author: author,
//       purpose: purpose,
//       user_story: userStory,
//       acceptance_criteria: acceptanceCriteria,
//       business_value: businessValue,
//       wireframes: wireframes,
//       attachments: attachments,
//       votes: votes,
//       date_last_updated: dateLastUpdated,
//       product_name: productName,
//       user_email: userEmail
//     }
//   })
//     .then(response => {
//       this.getAllFeatures();
//     })
//     .catch(err => console.log(`editFeature err: ${err}`));
// }
