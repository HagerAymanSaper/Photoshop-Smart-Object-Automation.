#target photoshop
app.bringToFront();

/*
  SELECTED LAYERS -> SMART OBJECT COPIES
  1. Name the source Smart Object layer: DESIGN SOURCE
  2. Ctrl-click / Cmd-click the target shape layers.
  3. Run this script.
  Only selected eligible ArtLayers are processed.
  The Smart Object keeps its original size and scale (no resizing).
*/

(function () {
    if (!app.documents.length) { alert("Open your PSD first."); return; }
    var doc = app.activeDocument;
    var SOURCE_NAME = "DESIGN SOURCE";

    function px(v) { return v.as("px"); }

    function getBounds(layer) {
        var b = layer.bounds;
        var l = px(b[0]), t = px(b[1]), r = px(b[2]), bt = px(b[3]);
        var w = r-l, h = bt-t;
        if (!(w > 0 && h > 0)) return null;
        return {width:w, height:h, cx:l+w/2, cy:t+h/2};
    }

    function findByName(container, name) {
        for (var i=0; i<container.layers.length; i++) {
            var layer = container.layers[i];
            if (layer.name === name) return layer;
            if (layer.typename === "LayerSet") {
                var found = findByName(layer, name);
                if (found) return found;
            }
        }
        return null;
    }

    function selectedIDs() {
        var ids = [];
        try {
            var ref = new ActionReference();
            ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("targetLayersIDs"));
            ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var desc = executeActionGet(ref);
            var key = stringIDToTypeID("targetLayersIDs");
            if (desc.hasKey(key)) {
                var list = desc.getList(key);
                for (var i=0; i<list.count; i++) ids.push(list.getReference(i).getIdentifier());
            }
        } catch(e) {}
        if (!ids.length) {
            try { ids.push(doc.activeLayer.id); } catch(e2) {}
        }
        return ids;
    }

    function findByID(container, id) {
        for (var i=0; i<container.layers.length; i++) {
            var layer = container.layers[i];
            try { if (layer.id === id) return layer; } catch(e) {}
            if (layer.typename === "LayerSet") {
                var found = findByID(layer, id);
                if (found) return found;
            }
        }
        return null;
    }

    function eligible(layer) {
        if (!layer || layer.typename !== "ArtLayer") return false;
        try { if (layer.isBackgroundLayer) return false; } catch(e) {}
        try {
            return layer.kind === LayerKind.SOLIDFILL || layer.kind === LayerKind.NORMAL;
        } catch(e2) { return false; }
    }

    var source = findByName(doc, SOURCE_NAME);
    if (!source) {
        alert('Rename your design Smart Object layer exactly "DESIGN SOURCE", then run again.');
        return;
    }
    try {
        if (source.typename !== "ArtLayer" || source.kind !== LayerKind.SMARTOBJECT) {
            alert('"DESIGN SOURCE" must be a Smart Object layer.');
            return;
        }
    } catch(e3) { alert("Could not verify DESIGN SOURCE."); return; }

    var ids = selectedIDs(), targets = [], seen = {};
    for (var n=0; n<ids.length; n++) {
        var target = findByID(doc, ids[n]);
        if (!target || target.id === source.id || seen[target.id]) continue;
        seen[target.id] = true;
        if (eligible(target)) {
            try {
                var b = getBounds(target);
                if (b) targets.push({layer:target, bounds:b});
            } catch(e4) {}
        }
    }

    if (!targets.length) {
        alert("No eligible target layers selected.\n\nCtrl-click the shape layers you want to fill, then run again. DESIGN SOURCE is excluded.");
        return;
    }
    if (!confirm("Create " + targets.length + " clipped Smart Object copies?\nOnly selected eligible layers will be processed.")) return;

    var oldUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    var made=0, skipped=0, errors=[];

    try {
        for (var j=0; j<targets.length; j++) {
            var targetLayer=targets[j].layer, tb=targets[j].bounds, copy=null;
            try {
                copy = source.duplicate();
                copy.name = "Design - " + targetLayer.name;
                copy.move(targetLayer, ElementPlacement.PLACEBEFORE);

                var cb=getBounds(copy);
                if (!cb) throw new Error("Could not read Smart Object bounds.");
                copy.translate(tb.cx-cb.cx, tb.cy-cb.cy);
                copy.grouped=true;
                made++;
            } catch(err) {
                skipped++;
                errors.push(targetLayer.name + ": " + err.message);
            }
        }
    } finally {
        app.preferences.rulerUnits=oldUnits;
    }

    var msg="Done!\n\nCreated: "+made+"\nSkipped/errors: "+skipped;
    if (errors.length) msg+="\n\n"+errors.slice(0,8).join("\n")+(errors.length>8 ? "\n...and "+(errors.length-8)+" more." : "");
    alert(msg);
})();
