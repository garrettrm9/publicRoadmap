import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, TextArea, Label, Dialog } from "@blueprintjs/core";

export default class AddFeatureForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feature: {},
      modalOpen: false
    };
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.sendNewFeature = this.sendNewFeature.bind(this);
    this.renderProducts = this.renderProducts.bind(this);
  }

  sendNewFeature() {
    this.props.addFeature(this.state.feature);
    // console.log("sendNewFeature feature state", this.state.feature);
    this.setState({ feature: {} });
  }

  toggleOverlay() {
    // this.props.toggleOverlay();
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  changeHandler(e) {
    e.preventDefault();
    const date = new Date();
    const key = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      prevState.feature[key] = value;
      prevState.feature.user_email = this.props.user.email;
      prevState.feature.date_last_updated = date;
      return prevState;
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.setState({
    //   feature: {
    //     ...this.state.feature,
    //     user_email: this.props.user.email,
    //     date_last_updated: date
    //   }
    // });
    this.toggleOverlay();
    this.sendNewFeature();
  }

  renderProducts(product, index) {
    return (
      <option key={index} value={product.name}>
        {product.name}
      </option>
    );
  }

  render() {
    const productNames = this.props.products.map(this.renderProducts);
    return (
      <div className="addFeatureContainer">
        <h1 className="addFeatureHeader">Submit feature request</h1>
        <h2>As much detail as possible!</h2>
        <div>
          <Label>
            Name:
            <input
              type="text"
              placeholder="Feature name"
              className="bp3-input"
              onChange={this.changeHandler}
              name="name"
              value={this.state.feature.name}
            />
          </Label>
        </div>
        <div>
          <Label>
            Product:
            <br />
            <select
              onChange={this.changeHandler}
              name="product_name"
              value={this.state.feature.product_name}
            >
              {productNames}
            </select>
          </Label>
        </div>
        <div>
          <Label>
            Purpose:
            <TextArea
              type="text"
              placeholder="What does it do?"
              className="bp3-input"
              onChange={this.changeHandler}
              name="purpose"
              value={this.state.feature.purpose}
            />
          </Label>
        </div>
        <div>
          <Label>
            User story:
            <TextArea
              type="text"
              placeholder="Walk us through the feature"
              className="bp3-input"
              onChange={this.changeHandler}
              name="user_story"
              value={this.state.feature.user_story}
            />
          </Label>
        </div>
        <div>
          <Label>
            Acceptance criteria:
            <TextArea
              type="text"
              placeholder="Acceptance criteria"
              className="bp3-input"
              onChange={this.changeHandler}
              name="acceptance_criteria"
              value={this.state.feature.acceptance_criteria}
            />
          </Label>
        </div>
        <div>
          <Label>
            Business value:
            <TextArea
              type="text"
              placeholder="Business value"
              className="bp3-input"
              onChange={this.changeHandler}
              name="business_value"
              value={this.state.feature.business_value}
            />
          </Label>
        </div>
        <div>
          <Label>
            Wireframes:
            <input
              type="text"
              placeholder="Wireframes"
              className="bp3-input"
              onChange={this.changeHandler}
              name="wireframes"
              value={this.state.feature.wireframes}
            />
          </Label>
        </div>
        <div>
          <Label>
            Attachments:
            <input
              type="text"
              placeholder="Attachments"
              className="bp3-input"
              onChange={this.changeHandler}
              name="attachments"
              value={this.state.feature.attachments}
            />
          </Label>
        </div>
        <div>
          <Button
            type="submit"
            className="bp3-button bp3-intent-primary"
            onClick={this.toggleOverlay}
            text="Submit"
          />
          <Dialog isOpen={this.state.modalOpen} onClose={this.toggleOverlay}>
            <div className="bp3-dialog-container">
              <div className="bp3-dialog">
                <div className="bp3-dialog-header">
                  <h4 className="bp3-heading">New feature request</h4>
                  <Button
                    // aria-label="Close"
                    // className="bp3-dialog-close-button bp3-icon-small-cross"
                    onClick={this.toggleOverlay}
                    icon="cross"
                  />
                </div>
                <div className="bp3-dialog-body">
                  Are you sure you want to submit this feature request?
                </div>
                <div className="bp3-dialog-footer">
                  <div className="bp3-dialog-footer-actions">
                    <Button
                      type="submit"
                      className="bp3-button bp3-intent-primary"
                      onClick={this.handleSubmit}
                      text="Submit"
                    />
                    <Button
                      type="button"
                      className="bp3-button"
                      onClick={this.toggleOverlay}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
          <Link to="/home">
            <Button
              type="button"
              className="bp3-button"
              // onClick={this.toggleOverlay}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

//   render() {
//     const productNames = this.props.products.map(this.renderProducts);
//     return (
//       <div className="bp3-dialog-container">
//         <div className="bp3-dialog">
//           <div className="bp3-dialog-header">
//             <span className="bp3-icon-large bp3-icon-plus" />
//             <h4 className="bp3-heading">Submit feature request</h4>
//             <Button
//               // aria-label="Close"
//               // className="bp3-dialog-close-button bp3-icon-small-cross"
//               onClick={this.toggleOverlay}
//               icon="cross"
//             />
//           </div>
//           <div className="bp3-dialog-body">
//             <h4>As much detail as possible!</h4>
//             <div>
//               <Label>
//                 Name:
//                 <input
//                   type="text"
//                   placeholder="Feature name"
//                   className="bp3-input"
//                   onChange={this.changeHandler}
//                   name="name"
//                   value={this.state.feature.name}
//                 />
//               </Label>
//             </div>
//             <div className="bp3-select">
//               <Label>
//                 Product:
//                 <select
//                   onChange={this.changeHandler}
//                   name="product_name"
//                   value={this.state.feature.product_name}
//                 >
//                   {productNames}
//                 </select>
//               </Label>
//             </div>
//             <div>
//               <Label>
//                 Purpose:
//                 <TextArea
//                   type="text"
//                   placeholder="What does it do?"
//                   className="bp3-input"
//                   onChange={this.changeHandler}
//                   name="purpose"
//                   value={this.state.feature.purpose}
//                 />
//               </Label>
//             </div>
//             <div>
//               <Label>
//                 User story:
//                 <TextArea
//                   type="text"
//                   placeholder="Walk us through the feature"
//                   className="bp3-input"
//                   onChange={this.changeHandler}
//                   name="user_story"
//                   value={this.state.feature.user_story}
//                 />
//               </Label>
//             </div>
//             <div>
//               <Label>
//                 Acceptance criteria:
//                 <TextArea
//                   type="text"
//                   placeholder="Acceptance criteria"
//                   className="bp3-input"
//                   onChange={this.changeHandler}
//                   name="acceptance_criteria"
//                   value={this.state.feature.acceptance_criteria}
//                 />
//               </Label>
//             </div>
//             <div>
//               <Label>
//                 Business value:
//                 <TextArea
//                   type="text"
//                   placeholder="Business value"
//                   className="bp3-input"
//                   onChange={this.changeHandler}
//                   name="business_value"
//                   value={this.state.feature.business_value}
//                 />
//               </Label>
//             </div>
//             <div>
//               <Label>
//                 Wireframes:
//                 <input
//                   type="text"
//                   placeholder="Wireframes"
//                   className="bp3-input"
//                   onChange={this.changeHandler}
//                   name="wireframes"
//                   value={this.state.feature.wireframes}
//                 />
//               </Label>
//             </div>
//             <div>
//               <Label>
//                 Attachments:
//                 <input
//                   type="text"
//                   placeholder="Attachments"
//                   className="bp3-input"
//                   onChange={this.changeHandler}
//                   name="attachments"
//                   value={this.state.feature.attachments}
//                 />
//               </Label>
//             </div>
//           </div>
//           <div className="bp3-dialog-footer">
//             <div className="bp3-dialog-footer-actions">
//               <Button
//                 type="button"
//                 className="bp3-button"
//                 onClick={this.toggleOverlay}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="bp3-button bp3-intent-primary"
//                 onClick={this.handleSubmit}
//               >
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
