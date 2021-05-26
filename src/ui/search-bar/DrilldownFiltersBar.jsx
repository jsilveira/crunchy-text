import React, {Component} from 'react';

export default class DrilldownFiltersBar extends Component {
  constructor(props) {
    super(props);
    this.state = {value: this.props.value};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    // console.log('Original:', value)
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  // changes from the outside
  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;
    if (this.state.value != value) {
      this.setState({value});
    }
  }

  addFilter() {
    this.props.onDrilldownAction('addFilter');
  }

  addExclusion() {
    this.props.onDrilldownAction('addExclusion');
  }

  toggleFilter(step) {
    this.props.onDrilldownAction('toggleFilter', step.id);
  }

  removeStep(step) {
    this.props.onDrilldownAction('remove', step.id);
  }

  render() {
    let steps = this.props.drilldownSteps;

    let filterSteps = steps.map((step, i) => {
      let {searchQuery, isOn, type, affectedCount} = step;
      let typeIcon = <i className="material-icons align-middle">{ type === 'filter' ? 'filter_list' : 'remove_circle' }</i>
      let baseColor = isOn ? (type === 'filter' ? 'primary' : 'danger') : 'light'
      return <span key={i}>
        <span className={`btn btn-sm btn-${isOn ? baseColor : 'outline-'+baseColor}`}  onClick={this.toggleFilter.bind(this, step)}>
          { typeIcon }&nbsp;
          {searchQuery.replace(/[igm]+$/, '')} {isOn ? `(${affectedCount})`: ''}
        </span>
        <span className={'btn btn-sm btn-link p0 ps-0'} onClick={this.removeStep.bind(this, step)}>
          <i className="material-icons">close</i>
        </span>
      </span>
    });

    let stepsBar = [];
    if(filterSteps.length > 0) {
      stepsBar = <span className="bg-dark p-0 ps-2 pb-2 text-white">
        {filterSteps}
      </span>;
    }

    return (
      <div style={{zoom: '0.75'}} className="drilldown-filters-bar">
        <div className="container-fluid text-white p-0">
          { stepsBar }
          <span className={'btn btn-link text-white-50 pe-1'} onClick={this.addFilter.bind(this)}>
            <i className="material-icons align-middle pe-1">filter_list</i>
            <span>Search within results</span>
          </span>
          <span className='badge text-secondary fw-light bg-light'>Shift+Ent</span>

          <span className={'btn btn-link  text-white-50 pe-1'}  onClick={this.addExclusion.bind(this)}>
            <i className="material-icons align-middle pe-1">remove_circle_outline</i>
            Exclude results
          </span>
          <span className='badge text-secondary fw-light bg-light'>Ctrl+Ent</span>

          <span className={'text-white'}>
          </span>
        </div>
      </div>
    );
  }
}
