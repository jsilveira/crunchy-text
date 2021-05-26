import React, { Component } from 'react';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;

    try {
      // Try converting it to regex
      new RegExp(value)
      this.setState({ invalidRegex: false });
    } catch (err) {
      this.setState({ invalidRegex: true })
    }

    this.setState({ value });

    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  preventFormSubmitOnEnter(e) {
    var keyCode = e.keyCode || e.which;
    let KEYCODE_ENTER = 13;
    let KEYCODE_BACKSPACE = 8;

    if (keyCode === KEYCODE_ENTER) {
      this.setState({ value: '' });
      if(e.shiftKey && this.state.value) {
        this.props.onDrilldownAction('addFilter');
      }
      if(e.ctrlKey && this.state.value) {
        this.props.onDrilldownAction('addExclusion');
      }
      e.preventDefault();
      return false;
    }

    if(keyCode === KEYCODE_BACKSPACE && e.shiftKey && !this.state.value) {
      this.props.onDrilldownAction('remove');
    }
  }

  // changes from the outside
  // componentWillReceiveProps(nextProps) {
  //   const value = nextProps.value;
  //   if (this.state.value != value) {
  //     this.setState({ value });
  //   }
  // }

  render() {
    return (
      <div className="py-1">
        <div className="" id="navbarSupportedContent">
          <form className="my-0 my-lg-0">
            <input
              type="search"
              autoFocus={this.props.autoFocus}
              placeholder="Search text with regex..."
              onKeyDown={this.preventFormSubmitOnEnter.bind(this)}
              className={"form-control"+(this.state.invalidRegex ? ' text-danger' : '')}
              value={this.state.value}
              onChange={this.handleChange} />
          </form>
        </div>
      </div>
    );
  }
}
