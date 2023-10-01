import styled from 'styled-components';

export const Container = styled.div`
    max-width: 1000px;
    margin: 50px auto;
    padding: 0 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
`;

export const StyledButton = styled.button`
    margin: 10px 0;
    padding: 10px 20px;
    border: none;
    background-color: #007BFF;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }
`;

export const ProfileInfo = styled.div`
    margin: 20px 0;
    border-bottom: 2px solid #eee;
    padding-bottom: 20px;
`;

export const SectionTitle = styled.h3`
    margin-top: 20px;
    border-bottom: 2px solid #007BFF;
    padding-bottom: 5px;
`;

export const Form = styled.form`
    margin: 20px 0;
`;

export const LabelInputPair = styled.div`
    margin: 10px 0;

    label {
        display: block;
        margin-bottom: 5px;
    }
`;

export const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

export const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;

export const TableStyles = styled.div`
    margin-top: 20px;

    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
        
        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
    }

    .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
    }
`;

export const PaginationControls = styled.div`
    display: flex;
    align-items: center;

    button, select, input {
        margin-left: 10px;
    }
`;
