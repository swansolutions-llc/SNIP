import PropTypes from 'prop-types';

const Paragraph = ({ParagraphText})=>{
    const Pragraphstyle = "text-sceondary";
    return(
        <p className={Pragraphstyle}>{ParagraphText}</p>
    );
};

Paragraph.proptypes = {
    ParagraphText:PropTypes.string.isRequired
}

export default Paragraph;