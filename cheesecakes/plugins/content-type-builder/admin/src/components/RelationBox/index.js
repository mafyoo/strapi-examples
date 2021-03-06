/**
 *
 * RelationBox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty, map, startCase } from 'lodash';
import pluralize from 'pluralize';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Input from 'components/InputsIndex';
import styles from './styles.scss';

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-wrap-multilines */
class RelationBox extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };
  }

  getPlaceholder = () => {
    switch (true) {
      case this.props.relationType === 'oneToMany' && this.props.isFirstContentType:
        return pluralize(this.props.contentTypeTargetPlaceholder);
      case this.props.relationType === 'manyToOne' && !this.props.isFirstContentType:
        return pluralize(this.props.contentTypeTargetPlaceholder);
      case this.props.relationType === 'manyToMany':
        return pluralize(this.props.contentTypeTargetPlaceholder);
      default:
        return this.props.contentTypeTargetPlaceholder;
    }
  }

  toggle = () => this.setState({ showMenu: !this.state.showMenu });

  renderDropdownMenu = () => (
    <div className={styles.dropDown}>
      <ButtonDropdown
        isOpen={this.state.showMenu}
        toggle={this.toggle}
        style={{ backgroundColor: 'transparent' }}
      >
        <DropdownToggle caret />
        <DropdownMenu className={styles.dropDownContent}>
          {map(this.props.dropDownItems, (value, key) => {
            const id = value.source ? `${value.name}.${value.source}` : `${value.name}. `;
            let divStyle;

            if (
              get(this.props.header, 'name') === value.name &&
              !isEmpty(get(this.props.header, 'source')) &&
              value.source
            ) {
              divStyle = { color: '#323740', fontWeight: 'bold' };
            } else if (
              value.source === get(this.props.header, 'source') &&
              value.name === get(this.props.header, 'name')
            ) {
              divStyle = { color: '#323740', fontWeight: 'bold' };
            } else {
              divStyle = { color: 'rgba(50,55,64,0.75)' };
            }

            return (
              <div style={{ height: '3.6rem' }} key={key}>
                <DropdownItem onClick={this.props.onClick} id={id}>
                  <div style={divStyle} id={`${value.name}.${value.source}`}>
                    <i className={`fa ${value.icon}`} style={divStyle} id={id} />
                    {value.name}&nbsp;
                    {value.source && (
                      <FormattedMessage id="content-type-builder.from">
                        {message => (
                          <span style={{ fontStyle: 'italic' }} id={id}>
                            ({message}: {value.source})
                          </span>
                        )}
                      </FormattedMessage>
                    )}
                  </div>
                </DropdownItem>
              </div>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );

  render() {
    return (
      <div className={styles.relationBox}>
        <div className={styles.headerContainer}>
          <i className={`fa ${get(this.props.header, 'icon')}`} />
          {startCase(get(this.props.header, 'name'))}&nbsp;
          <span style={{ fontStyle: 'italic', fontWeight: '500' }}>
            {get(this.props.header, 'source') ? `(${get(this.props.header, 'source')})` : ''}
          </span>
          {!isEmpty(this.props.dropDownItems) && this.renderDropdownMenu()}
        </div>
        <div className={styles.inputContainer}>
          <form onSubmit={this.props.onSubmit}>
            <div className="container-fluid">
              <div className={`row ${styles.input}`}>
                {!isEmpty(this.props.input) && (
                  <Input
                    disabled={this.props.relationType === 'oneWay' && this.props.tabIndex === '2'}
                    tabIndex={this.props.tabIndex}
                    type={get(this.props.input, 'type')}
                    onChange={this.props.onChange}
                    label={get(this.props.input, 'label')}
                    name={get(this.props.input, 'name')}
                    value={this.props.value}
                    placeholder={this.getPlaceholder()}
                    customBootstrapClass="col-md-12"
                    validations={get(this.props.input, 'validations')}
                    errors={this.props.errors}
                    didCheckErrors={this.props.didCheckErrors}
                    pluginID="content-type-builder"
                    autoFocus={this.props.autoFocus}
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

RelationBox.propTypes = {
  autoFocus: PropTypes.bool,
  contentTypeTargetPlaceholder: PropTypes.string,
  didCheckErrors: PropTypes.bool.isRequired,
  dropDownItems: PropTypes.array,
  errors: PropTypes.array,
  header: PropTypes.object,
  input: PropTypes.object,
  isFirstContentType: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  relationType: PropTypes.string,
  tabIndex: PropTypes.string.isRequired,
  value: PropTypes.string,
};

RelationBox.defaultProps = {
  autoFocus: false,
  contentTypeTargetPlaceholder: '',
  dropDownItems: [],
  errors: [],
  header: {},
  input: {},
  isFirstContentType: false,
  onClick: () => {},
  relationType: 'oneToOne',
  value: '',
};

export default RelationBox;
