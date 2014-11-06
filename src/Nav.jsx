var React = require('react');
var joinClasses = require('react/lib/joinClasses');
var BootstrapMixin = require('./BootstrapMixin');
var CollapsableMixin = require('./CollapsableMixin');
var classSet = require('react/lib/cx');
var domUtils = require('./utils/domUtils');
var cloneWithProps = require('react/lib/cloneWithProps');

var ValidComponentChildren = require('./utils/ValidComponentChildren');
var createChainedFunction = require('./utils/createChainedFunction');


var Nav = React.createClass({
  mixins: [BootstrapMixin, CollapsableMixin],

  propTypes: {
    bsStyle: React.PropTypes.oneOf(['tabs','pills']),
    stacked: React.PropTypes.bool,
    justified: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    collapsable: React.PropTypes.bool,
    expanded: React.PropTypes.bool,
    navbar: React.PropTypes.bool,
    selectKey: React.PropTypes.any
  },

  getDefaultProps: function () {
    return {
      bsClass: 'nav'
    };
  },

  getCollapsableDOMNode: function () {
    return this.getDOMNode();
  },

  getCollapsableDimensionValue: function () {
    var node = this.refs.ul.getDOMNode(),
        height = node.offsetHeight,
        computedStyles = domUtils.getComputedStyles(node);

    return height + parseInt(computedStyles.marginTop, 10) + parseInt(computedStyles.marginBottom, 10);
  },

  render: function () {
    var classes = this.props.collapsable ? this.getCollapsableClassSet() : {};

    classes['navbar-collapse'] = this.props.collapsable;

    if (this.props.navbar && !this.props.collapsable) {
      return (this.renderUl());
    }

    return (
      <nav {...this.props} className={joinClasses(this.props.className, classSet(classes))}>
        {this.renderUl()}
      </nav>
    );
  },

  renderUl: function () {
    var classes = this.getBsClassSet();

    classes['nav-stacked'] = this.props.stacked;
    classes['nav-justified'] = this.props.justified;
    classes['navbar-nav'] = this.props.navbar;
    classes['pull-right'] = this.props.pullRight;

    return (
      <ul {...this.props} className={joinClasses(this.props.className, classSet(classes))} ref="ul">
        {ValidComponentChildren.map(this.props.children, this.renderNavItem)}
      </ul>
    );
  },

  getChildActiveProp: function (child) {
    if (child.props.active) {
      return true;
    }
    if (this.props.activeKey != null) {
      if (child.props.selectKey == this.props.activeKey) {
        return true;
      }
    }
    if (this.props.activeHref != null) {
      if (child.props.href === this.props.activeHref) {
        return true;
      }
    }

    return child.props.active;
  },

  renderNavItem: function (child, index) {
    return cloneWithProps(
      child,
      {
        active: this.getChildActiveProp(child),
        activeKey: this.props.activeKey,
        activeHref: this.props.activeHref,
        onSelect: createChainedFunction(child.props.onSelect, this.props.onSelect),
        ref: child.ref,
        key: child.key ? child.key : index,
        navItem: true
      }
    );
  }
});

module.exports = Nav;
