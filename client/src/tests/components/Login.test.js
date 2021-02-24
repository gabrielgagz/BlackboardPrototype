import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../components/Login';

describe('Login component tests', () => {

    test('Component should be rendered', () => {
        
        const wrapper = shallow( <Login /> );

        expect( wrapper ).toMatchSnapshot();

    });
    
});


