import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import MarkerManager from '../../util/marker_manager';

const _getCoordsObj = latLng => ({
  lat: latLng.lat(),
  lng: latLng.lng()
});

let _mapOptions = {
  center: {lat: 37.773972, lng: -122.431297}, // San Francisco coords
  zoom: 13
};

class BenchMap extends Component {

  componentDidMount() {
    const map = this.refs.map;
    this.map = new google.maps.Map(map, _mapOptions);
    this.MarkerManager = new MarkerManager(this.map, this._handleMarkerClick.bind(this));
    if (this.props.singleBench) {
      this.props.fetchBench(this.props.benchId);
    } else {
      this._registerListeners();
      this.MarkerManager.updateMarkers(this.props.benches);
    }
  }

  componentDidUpdate() {
    if(this.props.singleBench){
      this.MarkerManager.updateMarkers([this.props.benches[Object.keys(this.props.benches)[0]]]); //grabs only that one bench
    } else {
      this.MarkerManager.updateMarkers(this.props.benches);
    }
  }

  _registerListeners() {
    google.maps.event.addListener(this.map, 'idle', () => {
      const { north, south, east, west } = this.map.getBounds().toJSON();
      const bounds = {
        northEast: { lat:north, lng: east },
        southWest: { lat: south, lng: west } };
      this.props.updateFilter('bounds', bounds);
    });
    google.maps.event.addListener(this.map, 'click', event => {
      const coords = _getCoordsObj(event.latLng);
      this._handleClick(coords);
    });
  }

  _handleMarkerClick(bench) {
    this.props.history.push(`benches/${bench.id}`);
  }

  _handleClick(coords) {
    this.props.history.push({
      pathname: "benches/new",
      search: `lat=${coords.lat}&lng=${coords.lng}`
    });
  }

  render() {
    return <div className="map" ref="map">Map</div>;
  }
}

export default withRouter(BenchMap);

