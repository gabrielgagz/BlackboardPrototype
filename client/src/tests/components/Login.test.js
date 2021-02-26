import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../components/Login';

describe('Login component tests', () => {

    const wrapper = shallow( <Login /> );

    test('Component should be rendered', () => {

        expect( wrapper ).toMatchSnapshot();

    });
    
});


