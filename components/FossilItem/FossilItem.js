import { Table } from 'semantic-ui-react';
import fetch from 'node-fetch';
import _ from 'lodash';
import { get } from 'lodash/object';
import PropTypes from 'prop-types';
import withAuthUser from '../../utils/pageWrappers/withAuthUser';
import withAuthUserInfo from '../../utils/pageWrappers/withAuthUserInfo';

const FossilItem = (props) => {
  const { fossil, isSavedToProgress, handleSelect, AuthUserInfo } = props;
  return (
    <>
      <Table.Row
        className={isSavedToProgress ? 'is-saved' : null}
        onClick={async () => {
          const AuthUser = get(AuthUserInfo, 'AuthUser', null);
          {
            !AuthUser ? alert('Please sign in to start collecting!') : null;
          }

          const response = await fetch('/api/user-progress');
          const userProgress = await response.json();
          let requestBody;
          if (userProgress.data && userProgress.data.fossils) {
            let fossilMatch = false;
            userProgress.data.fossils.map((fossilName) => {
              if (fossilName === fossil.name) {
                fossilMatch = true;
              }
            });
            if (fossilMatch) {
              const filteredFossils = userProgress.data.fossils.filter(
                (fossilName) => {
                  return fossilName !== fossil.name;
                }
              );
              requestBody = { fossils: filteredFossils };
            } else {
              requestBody = {
                fossils: [...userProgress.data.fossils, fossil.name],
              };
            }
          } else {
            requestBody = { fossils: [fossil.name] };
          }

          fetch('/api/user-progress', {
            method: 'POST',
            body: JSON.stringify(requestBody),
          })
            .then((res) => res.json())
            .then(
              (response) => {
                console.log(response);
              },
              (error) => {
                console.log(error);
              }
            );
          handleSelect(requestBody);
        }}
      >
        <Table.Cell>
          <img width="80" src={fossil.imageLink}></img>
        </Table.Cell>
        <Table.Cell>{_.startCase(_.toLower(fossil.name))}</Table.Cell>

        <Table.Cell>
          {' '}
          <img width="20" src="images/bells-icon.png"></img>
          &nbsp; {fossil.price}
        </Table.Cell>
      </Table.Row>
      <style jsx global>{`
        tr:hover {
          background-color: beige;
        }

        .is-saved {
          background-image: url(images/wood.jpg);
        }
        .ui.table tr td,
        .ui.table {
          border-top: none;
          border: none;
        }

        .ui.table {
          border-radius: 20px;
        }
        tr {
          -moz-transition: all 0.3s ease-in;
          -o-transition: all 0.3s ease-in;
          -webkit-transition: all 0.3s ease-in;
          transition: all 0.3s ease-in;
        }

        @media only screen and (max-width: 768px) {
          .ui.table tr {
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

const mockFetchData = async (userId) => ({
  user: {
    ...(userId && {
      id: userId,
    }),
  },
});

FossilItem.getInitialProps = async (ctx) => {
  // Get the AuthUserInfo object. This is set in `withAuthUser.js`.
  // The AuthUserInfo object is available on both the server and client.
  const AuthUserInfo = get(ctx, 'myCustomData.AuthUserInfo', null);
  const AuthUser = get(AuthUserInfo, 'AuthUser', null);

  // You can also get the token (e.g., to authorize a request when fetching data)
  // const AuthUserToken = get(AuthUserInfo, 'token', null)

  // You can fetch data here.
  const data = await mockFetchData(get(AuthUser, 'id'));

  return {
    data,
  };
};

FossilItem.displayName = 'FossilItem';

FossilItem.propTypes = {
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
  }),
  data: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }),
};

FossilItem.defaultProps = {
  AuthUserInfo: null,
};

export default withAuthUser(withAuthUserInfo(FossilItem));
