import {Box, Button, Card, CardActions, CardContent, Stack, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import '../../css/PresenterCard.css';
import URL from '../../providers/APIProvider/URL.js';
import Image from '../image/Image.jsx';
import React from "react";

const PresenterCard = ({name, photo, desc, logo, onClick}) => {
    return (
        <Box className="presenter-card">
            <Card
                sx={{
                    height: 430,
                    minWidth: 275,
                    maxWidth: 300,
                    bgcolor: 'var(--background-color-lighter-20)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                raised
                onClick={onClick}
            >
                <CardContent>
                    <Stack alignItems="center" justifyContent="center" gap={1}>
                        <Image
                            src={`${URL.baseURL}${photo}`}
                            style={{
                                width: '190px',
                                height: '190px',
                                borderRadius: '10px',
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                        />
                        <Typography sx={{
                            textAlign: 'center',
                            borderBottom: '1px solid white',
                            width: '100%'
                        }} variant="h5">
                            {name}
                        </Typography>
                        <Stack flexDirection="column" alignItems="center" gap={1}>
                            <Image
                                src={`${URL.baseURL}${logo}`}
                                style={{
                                    width: 'fit-content',
                                    height: '40px',
                                    borderRadius: '10px',
                                    objectFit: 'fit',
                                    objectPosition: 'center',
                                }}
                            />
                            <Typography variant="string" fontSize="15px" style={{fontWeight: 'lighter'}}>
                                {desc}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
                <CardActions sx={{marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Button>View Details</Button>
                </CardActions>
            </Card>
        </Box>
    );
};

PresenterCard.propTypes = {
    name: PropTypes.string,
    photo: PropTypes.string,
    desc: PropTypes.string,
    onClick: PropTypes.func,
};

export default PresenterCard;
