import React from 'react';
import Tag from './Tag';

export default class Container extends React.Component  {

    render() {
        return (
            <div>
                 <ul>
                    {this.props.data.length <= 0
                        ? 'NO DB ENTRIES YET'
                        : this.props.data.map((dat) => (
                            <li style={{ padding: '10px' }} key={this.props.data.message}>
                            <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                            <span style={{ color: 'gray' }}> data: </span>
                            {dat.message}
                            </li>
                        ))}
                    </ul>
                    <Tag />
            </div>
        );
    }
}