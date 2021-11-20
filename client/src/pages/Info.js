import React from 'react';
import {Navigate, useParams} from "react-router-dom";
import {
	gql,
	useQuery
} from "@apollo/client";

import Container from "../components/Container";
import Row from "../components/Row";
import Column from "../components/Column";
import Button from "../components/Button";
import CodeBlock from "../components/CodeBlock";
import Notification from "../components/Notification";

// @todo Link flagging

const Info = () => {
	const params = useParams();
	const isValid = (params._id && (/^[a-f\d]{24}$/i.test(params._id)));

	const { loading, error, data } = useQuery(gql`
        query GetLink($_id: ID!) {
            getLink(_id: $_id) {
                _id
                target
                created
                clicks
                flagCount
            }
        }
	`, {
		skip: !isValid,
		variables: {
			_id: params._id
		}
	});

	if (!isValid) return (<Navigate to="/" replace={true} />);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error! {error}</p>;

	if (!data || !data.getLink ) return (<Navigate to="/" replace={true} />);

	return (
		<Container>
			{ (data.getLink.flagCount > 5) && <Notification color={"warning"}>This link was flagged multiple times, we are investigating it!</Notification> }
			<h2>{data.getLink._id}</h2>
			<Row>
				<Column>
					<div>
						<h3>Creation time</h3>
						<p>{new Date(data.getLink.created).toLocaleString()}</p>
					</div>
				</Column>
				<Column>
					<div>
						<h3>Click count</h3>
						<p>{data.getLink.clicks} clicks</p>
					</div>
				</Column>
			</Row>
			<Row>
				<Column>
					<h3>Target URL</h3>
					<CodeBlock>{data.getLink.target}</CodeBlock>
				</Column>
			</Row>
			<Row>
				<Column><p>Let us know if this link is being used maliciously.</p></Column>
				<Column shrink={true}><Button color="danger" label="Flag for moderation" /></Column>
			</Row>
		</Container>
	)
}

export default Info;