import React, {useEffect} from 'react';
import {
	Navigate,
	useParams
} from "react-router-dom";

import Container from "../components/Container";
import {gql, useMutation, useQuery} from "@apollo/client";

// @todo Add confirmation before proceeding to flagged links

const Redirect = () => {
	const params = useParams();
	const isValid = (params._id && (/^[a-f\d]{24}$/i.test(params._id)));

	let target;

	const { loading, error, data } = useQuery(gql`
        query GetLink($_id: ID!) {
            getLink(_id: $_id) {
                _id
                target
                clicks
            }
        }
	`, {
		skip: !isValid,
		variables: {
			"_id": params._id
		},
		onCompleted: (data) => { target = data.getLink.target }
	});

	// @todo Replace when Client Hints out
	const clickData = navigator.userAgentData;

	let clicked = false;

	const [addClick] = useMutation(gql`
        mutation addClick($input: ClickInput) {
            addClick(input: $input) {
                click {
                    _id
					link {
						target
					}
                }
            }
        }
	`, {
		variables: {
			"input": {
				"link": params._id,
				"platform": clickData.platform,
				"isMobile": clickData.mobile
			}
		},
		onCompleted: (data) => {
			clicked = true;
			window.location.replace(data.addClick.click.link.target);
		}
	});

	useEffect(addClick, [clicked])

	if (!isValid) return (<Navigate to="/" replace={true} />);

	if (loading) return <p>Retrieving data...</p>;
	if (error) return <p>Error! {error}</p>;

	if (!data || !data.getLink) return (<Navigate to="/" replace={true} />);

	return (
		<React.Fragment>
			<Container>
				<h2>You will be redirected soon...</h2>
			</Container>
		</React.Fragment>
	)
}

export default Redirect;