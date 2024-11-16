import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-database';

interface Player {
    id: string;
    name: string;
    position: string;
}

export class MainViewModel extends Observable {
    private _playerName: string = '';
    private _position: string = '';
    private _status: string = '';
    private _players: Array<Player> = [];
    private database: any;

    constructor() {
        super();
        
        try {
            // Get database instance
            this.database = firebase().database();
            this.setupRealtimeSync();
            this.status = 'Connected to Firebase';
        } catch (error) {
            this.status = `Database connection error: ${error}`;
            console.error('Database connection error:', error);
        }
    }

    get playerName(): string {
        return this._playerName;
    }

    set playerName(value: string) {
        if (this._playerName !== value) {
            this._playerName = value;
            this.notifyPropertyChange('playerName', value);
        }
    }

    get position(): string {
        return this._position;
    }

    set position(value: string) {
        if (this._position !== value) {
            this._position = value;
            this.notifyPropertyChange('position', value);
        }
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        if (this._status !== value) {
            this._status = value;
            this.notifyPropertyChange('status', value);
        }
    }

    get players(): Array<Player> {
        return this._players;
    }

    set players(value: Array<Player>) {
        if (this._players !== value) {
            this._players = value;
            this.notifyPropertyChange('players', value);
        }
    }

    setupRealtimeSync() {
        const playersRef = this.database.ref('/players');
        
        playersRef.on('value', (snapshot) => {
            const data = snapshot.val();
            const players: Array<Player> = [];
            
            if (data) {
                Object.keys(data).forEach(key => {
                    players.push({
                        id: key,
                        name: data[key].name,
                        position: data[key].position
                    });
                });
            }
            
            this.players = players;
        }, (error) => {
            this.status = `Database sync error: ${error.message}`;
            console.error('Database sync error:', error);
        });
    }

    addPlayer() {
        if (!this.playerName || !this.position) {
            this.status = 'Please fill in all fields';
            return;
        }

        const playersRef = this.database.ref('/players');
        playersRef.push({
            name: this.playerName,
            position: this.position
        })
        .then(() => {
            this.status = 'Player added successfully';
            this.playerName = '';
            this.position = '';
        })
        .catch(error => {
            this.status = `Error adding player: ${error.message}`;
            console.error('Error adding player:', error);
        });
    }

    deletePlayer(args: any) {
        const player = this.players[args.index];
        const playerRef = this.database.ref(`/players/${player.id}`);
        
        playerRef.remove()
            .then(() => {
                this.status = 'Player deleted successfully';
            })
            .catch(error => {
                this.status = `Error deleting player: ${error.message}`;
                console.error('Error deleting player:', error);
            });
    }

    onPlayerTap(args: any) {
        const player = this.players[args.index];
        this.status = `Selected: ${player.name}`;
    }
}