import React from 'react';
import { shallow } from 'enzyme';
import { Main } from '../../components/Main';

describe('Main component tests', () => {

    test('Component should be rendered', () => {
        
        const wrapper = shallow( <Main /> );

        expect( wrapper ).toMatchSnapshot();

    });
    
});


