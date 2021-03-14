import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Blackboard } from '../../components/Blackboard';

describe('Blackboard component tests', () => {

    test('Component should be rendered', () => {
        
        const wrapper = shallow( 
                                <MemoryRouter>
                                    <Blackboard /> 
                                </MemoryRouter>    
                                );

        expect( wrapper ).toMatchSnapshot();

    });
    
});