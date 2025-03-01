import React from 'react';
import Card from './Card';
import './Swimlane.css';
import Dragula from 'dragula';

export default class Swimlane extends React.Component {

  componentDidMount() {
    // Initialize dragula for the current swimlane
    const drake = Dragula([this.props.dragulaRef.current]);

    drake.containers.forEach(container => {
      container.addEventListener('touchmove', (e) => {
        e.preventDefault();  // Allow preventing default actions in touchmove
      }, { passive: false });
    });
    
    drake.on('drop', (el, target) => {
      const clientId = el.getAttribute('data-id');
      const newStatus = target.getAttribute('data-status'); // Assuming the swimlane has a data-status attribute
      this.props.updateClientStatus(clientId, newStatus);
    });
  }

  render() {
    const cards = this.props.clients.map(client => {
      return (
        <Card
          key={client.id}
          id={client.id}
          name={client.name}
          description={client.description}
          status={client.status}
        />
      );
    });

    return (
      <div className="Swimlane-column" data-status={this.props.name.toLowerCase()}>
        <div className="Swimlane-title">{this.props.name}</div>
        <div className="Swimlane-dragColumn" ref={this.props.dragulaRef}>
          {cards}
        </div>
      </div>
    );
  }
}
