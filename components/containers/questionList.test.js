import { render, screen } from "@testing-library/react";
import QuestionList from "./questionList";

describe("App", () => {
  it("renders without crashing", () => {
    render(<QuestionList />);
    expect(screen).toMatchSnapshot()
  });


  it('check month and years dropdowns displayed', () => {  
    const props = {
            showMonthYearsDropdowns: true
        },
        DateInputComponent = mount(<DateInput {...props} />).find('.datepicker');
    expect(DateInputComponent.hasClass('react-datepicker-hide-month')).toEqual(true);
});

});