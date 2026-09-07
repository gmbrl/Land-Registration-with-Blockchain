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

class SellerInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LandInstance: undefined,
            account: null,
            web3: null,
            verified: '',
            sellerRows: [],
            loadingSellers: true,
        }
    }

    verifySeller = (item) => async () => {
        await this.state.LandInstance.methods.verifySeller(
            item
        ).send({
            from: this.state.account,
            gas: 2100000
        });

        //Reload
        window.location.reload(false);
    }

    NotverifySeller = (item) => async () => {
        await this.state.LandInstance.methods.rejectSeller(
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

            const sellersCount = await instance.methods.getSellersCount().call();

            const sellersMap = await instance.methods.getSeller().call();

            const verified = await instance.methods.isLandInspector(currentAddress).call();
            this.setState({ verified: verified });

            // Fetch every seller's details in parallel, then build the rows
            // once everything has arrived, and only then setState.
            const sellerPromises = [];
            for (let i = 0; i < sellersCount; i++) {
                const sellerAddress = sellersMap[i];
                sellerPromises.push(Promise.all([
                    instance.methods.getSellerDetails(sellerAddress).call(),
                    instance.methods.isVerified(sellerAddress).call(),
                    instance.methods.isRejected(sellerAddress).call(),
                ]).then(([seller, sellerVerified, notVerified]) => ({
                    address: sellerAddress,
                    seller,
                    sellerVerified,
                    notVerified,
                })));
            }

            const sellers = await Promise.all(sellerPromises);

            const sellerRows = sellers.map((entry, i) => (
                <tr key={entry.address}>
                    <td>{i + 1}</td>
                    <td>{entry.address}</td>
                    <td>{entry.seller[0]}</td>
                    <td>{entry.seller[1]}</td>
                    <td>{entry.seller[2]}</td>
                    <td>{entry.seller[3]}</td>
                    <td>{entry.seller[4]}</td>
                    <td>
                        <a href={`https://gateway.pinata.cloud/ipfs/${entry.seller[5]}`} target="_blank" rel="noopener noreferrer">
                            Click Here
                        </a>
                    </td>
                    <td>{entry.sellerVerified.toString()}</td>
                    <td>
                        <Button onClick={this.verifySeller(entry.address)} disabled={entry.sellerVerified || entry.notVerified} className="button-vote">
                            Verify
                        </Button>
                    </td>
                    <td>
                        <Button onClick={this.NotverifySeller(entry.address)} disabled={entry.sellerVerified || entry.notVerified} className="btn btn-danger">
                            Reject
                        </Button>
                    </td>
                </tr>
            ));

            this.setState({ sellerRows: sellerRows, loadingSellers: false });

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
                                        <CardTitle tag="h4">Sellers Info</CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        {this.state.loadingSellers ? (
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
                                                        <th>Aadhar Number</th>
                                                        <th>Pan Number</th>
                                                        <th>Owned Lands</th>
                                                        <th>Aadhar Card Document</th>
                                                        <th>Verification Status</th>
                                                        <th>Verify Seller</th>
                                                        <th>Reject Seller</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.sellerRows}
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

export default SellerInfo;