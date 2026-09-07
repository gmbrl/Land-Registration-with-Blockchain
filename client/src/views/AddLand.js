import React, { Component } from 'react';
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import ipfs from '../ipfs';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { Spinner,   FormFile} from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


class AddLand extends Component {
  constructor(props) {
    super(props)

    this.state = {
      LandInstance: undefined,
      account: null,
      web3: null,
      area: '',
      city: '',
      stateLoc: '',
      price: '',
      lands: null,
      verficationStatus: false,
      verified: '',
      registered: '',
      buffer: null,
      ipfsHash: '',
      propertyPID: '',
      surveyNum: '',
      buffer2: null,
      document: '',
      uploading: false,
    }
    this.captureFile = this.captureFile.bind(this);
    this.addimage = this.addimage.bind(this);
    this.captureDoc = this.captureDoc.bind(this);
    this.addDoc = this.addDoc.bind(this);
    this.addLand = this.addLand.bind(this);
  }

  componentDidMount = async () => {
    //For refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }

    try {
      //Get network provider and web3 instance
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LandContract.networks[networkId];
      const instance = new web3.eth.Contract(
        LandContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ LandInstance: instance, web3: web3, account: accounts[0] });
      const currentAddress = await web3.currentProvider.selectedAddress;
      console.log(currentAddress);
      this.setState({ LandInstance: instance, web3: web3, account: accounts[0] });
      var verified = await this.state.LandInstance.methods.isVerified(currentAddress).call();
      console.log(verified);
      this.setState({ verified: verified });
      var registered = await this.state.LandInstance.methods.isSeller(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // Uploads the land image to IPFS via Pinata and stores the returned CID.
  addimage = async () => {
    if (!this.state.buffer) {
      throw new Error('No land image selected.');
    }
    const hash = await ipfs.addFile(this.state.buffer, 'land-image');
    this.setState({ ipfsHash: hash });
    console.log('ipfsHash:', hash);
    return hash;
  }

  // Uploads the Aadhaar document to IPFS via Pinata and stores the returned CID.
  addDoc = async () => {
    if (!this.state.buffer2) {
      throw new Error('No document selected.');
    }
    const hash = await ipfs.addFile(this.state.buffer2, 'land-document');
    this.setState({ document: hash });
    console.log('document:', hash);
    return hash;
  }

  //QmYdztkcPJLmGmwLmM4nyBfVatoBMRDuUjmgBupjmTodAP
  addLand = async () => {
    // Validate the text fields up front, before touching IPFS or the chain.
    if (this.state.area === '' || this.state.city === '' || this.state.stateLoc === '' || this.state.price === '' || this.state.propertyPID === '' || this.state.surveyNum === '') {
      alert("All the fields are compulsory!");
      return;
    }
    if ((!Number(this.state.area)) || (!Number(this.state.price))) {
      alert("Land area and Price of Land must be a number!");
      return;
    }
    if (!this.state.buffer || !this.state.buffer2) {
      alert("Please select both the land image and the document.");
      return;
    }

    this.setState({ uploading: true });

    try {
      // Upload image and document to IPFS in parallel, then wait for both.
      await Promise.all([this.addimage(), this.addDoc()]);

      await this.state.LandInstance.methods.addLand(
        this.state.area,
        this.state.city,
        this.state.stateLoc,
        this.state.price,
        this.state.propertyPID,
        this.state.surveyNum,
        this.state.ipfsHash,
        this.state.document)
        .send({
          from: this.state.account,
          gas: 2100000
        }).then(response => {
          this.props.history.push("/Seller/SellerDashboard");
        });

      //Reload
      window.location.reload(false);
    } catch (error) {
      alert('Failed to add land: ' + error.message);
      console.error(error);
    } finally {
      this.setState({ uploading: false });
    }
  }
  // _city,string  _state, uint landPrice, uint _propertyPID,uint _surveyNum,string memory _ipfsHash

  updateArea = event => (
    this.setState({ area: event.target.value })
  )
  updateCity = event => (
    this.setState({ city: event.target.value })
  )
  updateState = event => (
    this.setState({ stateLoc: event.target.value })
  )
  updatePrice = event => (
    this.setState({ price: event.target.value })
  )
  updatePID = event => (
    this.setState({ propertyPID: event.target.value })
  )
  updateSurveyNum = event => (
    this.setState({ surveyNum: event.target.value })
  )
  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
    console.log('caoture file...')
  }
  captureDoc(event) {
    event.preventDefault()
    const file2 = event.target.files[0]
    const reader2 = new window.FileReader()
    reader2.readAsArrayBuffer(file2)
    reader2.onloadend = () => {
      this.setState({ buffer2: Buffer(reader2.result) })
      console.log('buffer2', this.state.buffer2)
    }
    console.log('caoture doc...')
  }

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <div>
            <h1>
              <Spinner animation="border" variant="primary" />
            </h1>
          </div>

        </div>
      );
    }

    if (!this.state.registered || !this.state.verified) {
      return (
        <div className="content">
          <div>
            <Row>
              <Col xs="6">
                <Card className="card-chart">
                  <CardBody>
                    <h1>
                      You are not verified to view this page
                                        </h1>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>

        </div>
      );
    }

    return (
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add Land</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Area (in sqm.)</label>
                        <Input
                          placeholder="Area"
                          type="text"
                          value={this.state.area}
                          onChange={this.updateArea}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>City</label>
                        <Input
                          placeholder="City"
                          type="text"
                          value={this.state.city}
                          onChange={this.updateCity}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>State</label>
                        <Input
                          placeholder="State"
                          type="text"
                          value={this.state.stateLoc}
                          onChange={this.updateState}
                        />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Price</label>
                        <Input
                          placeholder="Price"
                          type="text"
                          value={this.state.price}
                          onChange={this.updatePrice}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Property PID Number</label>
                        <Input
                          placeholder="Property PID"
                          type="text"
                          value={this.state.propertyPID}
                          onChange={this.updatePID}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Physical Survey Number</label>
                        <Input
                          placeholder="Survey Num"
                          type="text"
                          value={this.state.surveyNum}
                          onChange={this.updateSurveyNum}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Insert Land Image</label>
                        <FormFile
                          id="File1"
                          onChange={this.captureFile}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Insert Adhar card document</label>
                        <FormFile
                          id="File2"
                          onChange={this.captureDoc}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-fill" color="primary" onClick={this.addLand} disabled={this.state.uploading}>
                  {this.state.uploading ? <Spinner animation="border" size="sm" /> : 'Add Land'}
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );

  }
}

export default AddLand;