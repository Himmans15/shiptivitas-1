import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }

  // Update client status in state
  updateClientStatus(clientId, newStatus) {
    const updatedClients = { ...this.state.clients };

    // Ensure that each status array is properly initialized if it doesn't exist
    if (!updatedClients.backlog) updatedClients.backlog = [];
    if (!updatedClients.inProgress) updatedClients.inProgress = [];
    if (!updatedClients.complete) updatedClients.complete = [];

    // Remove the client from its previous status array
    Object.keys(updatedClients).forEach(status => {
      updatedClients[status] = updatedClients[status].filter(client => client.id !== clientId);
    });

    // Find the client and update its status
    const updatedClient = this.getClients().find(client => clientId === client.id);
    if (updatedClient) {
      updatedClient.status = newStatus;

      // Make sure that the new status array exists before pushing the updated client
      if (!updatedClients[newStatus]) {
        updatedClients[newStatus] = []; // Initialize the array if it doesn't exist
      }

      updatedClients[newStatus].push(updatedClient); // Add client to the new status array
    }

    // Update state with the modified clients
    this.setState({ clients: updatedClients });
  }

  // Initialize Dragula on component mount
  componentDidMount() {
    const drake = Dragula([this.swimlanes.backlog.current, this.swimlanes.inProgress.current, this.swimlanes.complete.current]);

    drake.containers.forEach(container => {
      container.addEventListener('touchmove', (e) => {
        e.preventDefault();  // Allow preventing default actions in touchmove
      }, { passive: false });
    });

    drake.on('drop', (el, target) => {
      const clientId = el.getAttribute('data-id');
      const newStatus = target.getAttribute('data-status');
      
      // Update client status
      this.updateClientStatus(clientId, newStatus);
    });
  }

  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane
        name={name}
        clients={clients}
        dragulaRef={ref}
        updateClientStatus={this.updateClientStatus.bind(this)} // Pass update function to Swimlane
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
