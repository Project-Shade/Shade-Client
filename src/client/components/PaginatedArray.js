import React from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import { cyan700, cyan800 } from 'material-ui/styles/colors';

import { updatePagination } from '../actions/appState';

class PaginatedArray extends React.Component {
  static propTypes = {
    appState: React.PropTypes.object.isRequired,
    component: React.PropTypes.func.isRequired,
    itemsPerPage: React.PropTypes.number,
    list: React.PropTypes.array.isRequired,
    updatePagination: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    itemsPerPage: 20,
  }

  generatePaginationNums(totalPages, currentPage) {
    const pageArr = [];
    if (totalPages === 1) {
      return [currentPage];
    }

    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) {
        pageArr.push(i);
      }
      return pageArr;
    }

    if (currentPage <= 4) {
      for (let i = 1; i <= 7; i++) {
        pageArr.push(i);
      }
      pageArr.push('...');
      pageArr.push(totalPages);
      return pageArr;
    }

    if (totalPages - currentPage <= 4) {
      pageArr.push(1);
      pageArr.push('...');
      for (let i = totalPages - 5; i <= totalPages; i++) {
        pageArr.push(i);
      }
      return pageArr;
    }

    pageArr.push(1);
    pageArr.push('...');
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      pageArr.push(i);
    }
    pageArr.push('...');
    pageArr.push(totalPages);

    return pageArr;
  }

  render() {
    const segment = [];
    for (let i = (this.props.appState.page - 1) * this.props.itemsPerPage; i <= (this.props.appState.page) * this.props.itemsPerPage; i++) {
      if (this.props.list[i]) {
        segment.push(this.props.list[i]);
      }
    }

    const pages = this.generatePaginationNums(Math.floor(this.props.list.length / this.props.itemsPerPage), this.props.appState.page);

    return (
      <div className="main">
        <div className="main-content">
          <this.props.component data={segment} />
        </div>
        <div className="pagination">
          {
            pages.map((pageNum, index) => {
              switch (pageNum) {
                case '...':
                  return (
                    <FlatButton key={`page_controller${index}`} label="..." disabled style={{ color: 'black', minWidth: 20 }} />
                  );
                default:
                  if (pageNum === this.props.appState.page) {
                    return (
                      <FlatButton
                        key={`page_controller${index}`}
                        label={pageNum} primary backgroundColor={cyan700} hoverColor={cyan800} style={{ color: 'black' }}
                        onClick={this.props.updatePagination.bind(this, pageNum)}
                      />
                    );
                  }
                  return (
                    <FlatButton
                      key={`page_controller${index}`}
                      label={pageNum} style={{ color: 'black', minWidth: 20 }}
                      onClick={this.props.updatePagination.bind(this, pageNum)}
                    />
                  );
              }
            })
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  appState: state.appState,
});

const mapDispatchToProps = (dispatch) => ({
  updatePagination: (loading) => dispatch(updatePagination(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaginatedArray);
