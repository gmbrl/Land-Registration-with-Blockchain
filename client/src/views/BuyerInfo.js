import React, { Component } from 'react';
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { Line, Bar } from "react-chartjs-2";
import '../index.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { DrizzleProvider } from 'drizzle-react';
import { Spinner } from 'react-bootstrap'
import {
    LoadingContainer,
    AccountData,
    ContractData,
    ContractForm
} from 'drizzle-react-components'

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Table,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap";

const drizzleOptions = {
    contracts: [Land]
}

function sendMail(email, name) {
    var tempParams = {
        from_name: email,
        to_name: name,
        function: 'request and buy any land/property',
    };

    window.emailjs.send('service_vrxa1ak', 'template_zhc8m9h', tempParams)
        .then(function (res) {
            alert("Mail sent successfully");
        })
}

class BuyerInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LandInstance: undefined,
            account: null,
            web3: null,
            verified: '',
            buyerRows: [],
            loadingBuyers: true,
        }
    }

    verifyBuyer = (item) => async () => {
        await this.state.LandInstance.methods.verifyBuyer(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        //Reload
        window.location.reload(false);
    }

    NotverifyBuyer = (item, email, name) => async () => {
        sendMail(email, name);

        await new Promise(resolve => setTimeout(resolve, 10000));

        await this.state.LandInstance.methods.rejectBuyer(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        window.location.reload(false);
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

            const currentAddress = await web3.currentProvider.selectedAddress;
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Land.networks[networkId];
            const instance = new web3.eth.Contract(
                Land.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ LandInstance: instance, web3: web3, account: accounts[0] });

            const buyersCount = await instance.methods.getBuyersCount().call();

            const buyersMap = await instance.methods.getBuyer().call();

            const verified = await instance.methods.isLandInspector(currentAddress).call();
            this.setState({ verified: verified });

            // Fetch every buyer's details in parallel, then build the rows
            // once everything has arrived, and only then setState.
            const buyerPromises = [];
            for (let i = 0; i < buyersCount; i++) {
                const buyerAddress = buyersMap[i];
                buyerPromises.push(Promise.all([
                    instance.methods.getBuyerDetails(buyerAddress).call(),
                    instance.methods.isVerified(buyerAddress).call(),
                    instance.methods.isRejected(buyerAddress).call(),
                ]).then(([buyer, buyerVerified, notVerified]) => ({
                    address: buyerAddress,
                    buyer,
                    buyerVerified,
                    notVerified,
                })));
            }

            const buyers = await Promise.all(buyerPromises);

            const buyerRows = buyers.map((entry, i) => (
                <tr key={entry.address}>
                    <td>{i + 1}</td>
                    <td>{entry.address}</td>
                    <td>{entry.buyer[0]}</td>
                    <td>{entry.buyer[5]}</td>
                    <td>{entry.buyer[4]}</td>
                    <td>{entry.buyer[1]}</td>
                    <td>{entry.buyer[6]}</td>
                    <td>{entry.buyer[2]}</td>
                    <td>
                        <a href={`https://gateway.pinata.cloud/ipfs/${entry.buyer[3]}`} target="_blank" rel="noopener noreferrer">
                            Click Here
                        </a>
                    </td>
                    <td>{entry.buyerVerified.toString()}</td>
                    <td>
                        <Button onClick={this.verifyBuyer(entry.address)} disabled={entry.buyerVerified || entry.notVerified} className="button-vote">
                            Verify
                        </Button>
                    </td>
                    <td>
                        <Button onClick={this.NotverifyBuyer(entry.address, entry.buyer[4], entry.buyer[0])} disabled={entry.buyerVerified || entry.notVerified} className="btn btn-danger">
                            Reject
                        </Button>
                    </td>
                </tr>
            ));

            this.setState({ buyerRows: buyerRows, loadingBuyers: false });

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

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

        if (!this.state.verified) {
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
            <DrizzleProvider options={drizzleOptions}>
                <LoadingContainer>
                    <div className="content">
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardHeader>
                                        <CardTitle tag="h5">Buyers Info</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        {this.state.loadingBuyers ? (
                                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                <Spinner animation="border" variant="primary" />
                                            </div>
                                        ) : (
                                            <Table className="tablesorter" responsive color="black">
                                                <thead className="text-primary">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Account Address</th>
                                                        <th>Name</th>
                                                        <th>Age</th>
                                                        <th>Email</th>
                                                        <th>City</th>
                                                        <th>Aadhar Number</th>
                                                        <th>Pan Number</th>
                                                        <th>Aadhar Card Document</th>
                                                        <th>Verification Status</th>
                                                        <th>Verify Buyer</th>
                                                        <th>Reject Buyer</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.buyerRows}
                                                </tbody>
                                            </Table>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </LoadingContainer>
            </DrizzleProvider>
        );

    }
}

export default BuyerInfo;