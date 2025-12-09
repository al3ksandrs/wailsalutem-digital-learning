import React from 'react';
import '../css/main-info-panel.css';

interface MainInfoPanelProps {
    pending?: number;
    matches?: number;
    connections?: number;
}

const MainInfoPanel: React.FC<MainInfoPanelProps> = ({
    pending = 0,
    matches = 0,
    connections = 0,
}) => {
    return (
        <div className="main-info-panel">
            <div className="info-item">
                <div className="icon-box icon-pending">
                    <div className="codicon codicon-search icon-white"></div>
                </div>
                <div className="info-text">
                    <div className="info-label">Openstaande verzoeken</div>
                    <div className="info-value">{pending}</div>
                </div>
            </div>

            <div className="info-item">
                <div className="icon-box icon-matches">
                    <div className="codicon codicon-account icon-white"></div>
                </div>
                <div className="info-text">
                    <div className="info-label">Matches</div>
                    <div className="info-value">{matches}</div>
                </div>
            </div>

            <div className="info-item">
                <div className="icon-box icon-connections">
                    <div className="codicon codicon-link icon-white"></div>
                </div>
                <div className="info-text">
                    <div className="info-label">Connecties</div>
                    <div className="info-value">{connections}</div>
                </div>
            </div>
        </div>
    );
};

export default MainInfoPanel;
