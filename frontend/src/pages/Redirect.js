import React from 'react';
import {
	Navigate,
	useParams
} from "react-router-dom";

import Container from "../components/Container";
import {gql, useQuery} from "@apollo/client";

// @todo Add createClick mutation

const Redirect = () => {
	const params = useParams();
	const isValid = (params._id && (/^[a-f\d]{24}$/i.test(params._id)));

	const query = gql`
        query GetLink($_id: ID!) {
            getLink(_id: $_id) {
                _id
                target
                url
                created
                clicks
                flagCount
            }
        }
	`;

	const { loading, error, data } = useQuery(query, {
		skip: !isValid,
		variables: {
			"_id": params._id
		}
	});

	if (!isValid) return (<Navigate to="/" replace={true} />);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error! {error}</p>;

	if (!data || !data.getLink) return (<Navigate to="/" replace={true} />);

	setTimeout(() => {
		window.location.replace(data.getLink.target);
	}, 5000);

	return (
		<Container>
			<h2>You will be redirected soon...</h2>
		</Container>
	)
}

export default Redirect;