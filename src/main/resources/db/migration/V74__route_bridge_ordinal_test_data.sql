--Update missing bridge ordinals in test data with route bridge ID, it's the safest bet for the order they have been sent in from LeLu
update sillari.route_bridge rb set ordinal = rb.id where rb.ordinal is null;
