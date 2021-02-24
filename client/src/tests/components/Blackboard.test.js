import React from 'react';
import { shallow } from 'enzyme';
import { Blackboard } from '../../components/Blackboard';

describe('Blackboard component tests', () => {

    test('Component should be rendered', () => {
        
        const wrapper = shallow( <Blackboard /> );

        expect( wrapper ).toMatchSnapshot();

    });
    
});