import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import { BsFillCursorFill } from "react-icons/bs";
import City from "./components/City";
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      cityName: "",
      cityInfo: [],
      err: {
        exists: false,
        msg: "",
      },
      sh: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      cityName: e.target.children[0].children[1].value,
    });
    let url = `https://eu1.locationiq.com/v1/search.php?key=pk.4a782b6f22a6f448625817dfd828280a&city=${this.state.cityName}&format=json`;
    axios
      .get(url)
      .then((res) => this.setState({ cityInfo: res.data }))
      .catch((err) =>
        this.setState({ err: { exists: true, msg: "error getting data" } })
      );
  };

  hideModal = () => {
    this.setState({
      sh: false,
    });
  };
  showMap = (obj) => {
    this.setState({
      sh: true,
      selectedCity: obj.props.cityName,
      modLo: obj.props.cityLon,
      modLa: obj.props.cityLat,
    });
  };
  handleHide = () => {
    this.setState({
      sh: false,
    });
  };
  render() {
    return (
      <Container fluid>
        <h1 className="text-center m-5">
          City Explorer <BsFillCursorFill />{" "}
        </h1>
        <Row className="d-flex justify-content-center flex-column align-items-center">
          <Col xl="3" xs="6">
            <Form
              onSubmit={(e) => this.handleSubmit(e)}
              className="d-flex flex-column border border-primary rounded p-3 align-self-center"
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Enter the city name to start</Form.Label>
                <input
                  id="cityInput"
                  type="text"
                  placeholder="Los Angeles"
                  className="w-100"
                ></input>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="align-self-center"
              >
                Explore!
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="d-flex flex-wrap justify-content-center h-100">
          {this.state.cityInfo.length > 0 ? (
            <Alert
              variant="info"
              className="text-center p-5 mt-5 align-middle"
              style={{ height: "1rem" }}
            >
              Results for <strong>{this.state.cityName}</strong>
            </Alert>
          ) : undefined}

          {this.state.cityInfo.map(({ lon, lat, display_name }, i) => {
            return (
              <City
                key={i}
                cityName={this.state.cityName}
                cityLon={lon}
                cityLat={lat}
                cityDisp={display_name}
                showMap={this.showMap}
              />
            );
          })}
        </Row>

        <Modal show={this.state.sh} onHide={this.handleHide} size='lg' className='m-auto'>
          <Modal.Header>
            <Modal.Title className="align-middle">
              {this.state.selectedCity}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={`https://maps.locationiq.com/v3/staticmap?key=pk.4a782b6f22a6f448625817dfd828280a&center=${this.state.modLa},${this.state.modLo}&zoom=15`} alt='' className='img-responsive text-center m-auto'/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal}>Hide</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}