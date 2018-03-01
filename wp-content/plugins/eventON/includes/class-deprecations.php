<?php
/**
 * Deprecated items for eventon
 */

// evo version 2.6.2
class evo_this_event{
	public function __construct($event_id){
		_deprecated_function( 'evo_this_event()', 'EventON 2.6.1' ,'EVO_Event()');

		return new EVO_Event($event_id);
	}
}